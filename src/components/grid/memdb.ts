import { EventSource } from '@core/core_events.js';

type RecordID = any; // Define RecordID as any
type FieldType = string | number | boolean | Date;

// Define a type for field definitions with additional parameters
type FieldDef = 
    | { type: 'string'; minLength?: number; maxLength?: number; format?: 'email'; required?: boolean }
    | { type: 'number'; min?: number; max?: number; required?: boolean }
    | { type: 'boolean'; required?: boolean };

// Define a type for records
type Record = {
    id: RecordID;
    [key: string]: FieldType;
};

// Model class
class Model {
    private structure: { [key: string]: FieldDef };

    constructor(structure: { [key: string]: FieldDef }) {
        this.structure = { ...structure };
    }

    // Validate data based on the model
    validate(data: { [key: string]: any }): void {
        for (const key in this.structure) {
            const field = this.structure[key];
            const value = data[key];

            if (field.required && value === undefined) {
                throw new Error(`Field ${key} is required`);
            }

            if ( value !== undefined && typeof value !== field.type) {
                throw new Error(`Field ${key} has an incorrect type`);
            }

            if (field.type === 'string' && value !== undefined) {
                if (field.minLength !== undefined && value.length < field.minLength) {
                    throw new Error(`Field ${key} is shorter than the minimum length of ${field.minLength}`);
                }
                if (field.maxLength !== undefined && value.length > field.maxLength) {
                    throw new Error(`Field ${key} is longer than the maximum length of ${field.maxLength}`);
                }
                if (field.format === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    throw new Error(`Field ${key} is not a valid email`);
                }
            }

            if (field.type === 'number' && value !== undefined) {
                if (field.min !== undefined && value < field.min) {
                    throw new Error(`Field ${key} is less than the minimum value of ${field.min}`);
                }
                if (field.max !== undefined && value > field.max) {
                    throw new Error(`Field ${key} is greater than the maximum value of ${field.max}`);
                }
            }
        }
    }

    // Get the structure of the model
    getStructure(): { [key: string]: FieldDef } {
        return this.structure;
    }

    // Create a record based on the model
    createRecord(data: { [key: string]: any }, copy: boolean): Record {
        this.validate(data);

        const recordData = copy ? { ...data } : data;

        return recordData as Record;
    }

    // Get the value of a specific field in a record
    getFieldValue(record: Record, fieldName: string): FieldType | undefined {
        if (fieldName in this.structure) {
            return record[fieldName];
        }
        throw new Error(`Field ${fieldName} does not exist in the model`);
    }
}

// MemoryDatabase class
class MemoryDatabase extends EventSource {
    private records: Record[] = [];
    private model: Model;

    constructor(model: Model) {
        super();
        this.model = model;
    }

    // Add a new record to the records array
    addRecord(record: Record): void {
        this.records.push(record);
        this.emit('recordAdded', record);
    }

    // Get the count of records
    getCount(): number {
        return this.records.length;
    }

    // Get a record by its index
    getRecordByIndex(index: number): Record | null {
        return this.records[index] || null;
    }

    // Get a record by its ID
    getRecordById(id: RecordID): Record | null {
        return this.records.find(record => record.id === id) || null;
    }

    // Get all records
    getAllRecords(): Record[] {
        return this.records;
    }

	// Remove a record by its ID
    removeRecordById(id: RecordID): void {
        const index = this.records.findIndex(record => record.id === id);
        if (index !== -1) {
            const removedRecord = this.records.splice(index, 1)[0];
            this.emit('recordRemoved', removedRecord);
        }
    }

    // Remove a record by its index
    removeRecordByIndex(index: number): void {
        if (index >= 0 && index < this.records.length) {
            const removedRecord = this.records.splice(index, 1)[0];
            this.emit('recordRemoved', removedRecord);
        }
    }
}

// DataView class
class DataView {
    private database: MemoryDatabase;
    private view: Int32Array = new Int32Array(0);
    private currentFilter: { field: string, valueOrPattern: any } | null = null;
    private currentSort: { field: string, ascending: boolean } | null = null;

    constructor(database: MemoryDatabase) {
        this.database = database;
        this.database.on('recordAdded', () => this.handleDatabaseChange());
    }

    // Initialize the view with all record indexes
    initializeView(): void {
        const recordCount = this.database.getCount();
        this.view = Int32Array.from({ length: recordCount }, (_, i) => i);
    }

    // Sort the view by a specified field
    sortView(field: string, ascending: boolean = true): void {
        this.currentSort = { field, ascending };
        this.applySort();
    }

    private applySort(): void {
        if (this.currentSort) {
            const { field, ascending } = this.currentSort;
            this.view = Int32Array.from(this.view).sort((a, b) => {
                const recordA = this.database.getRecordByIndex(a);
                const recordB = this.database.getRecordByIndex(b);

                if (recordA && recordB) {
                    const valueA = recordA[field];
                    const valueB = recordB[field];

                    if (valueA instanceof Date && valueB instanceof Date) {
                        return ascending ? valueA.getTime() - valueB.getTime() : valueB.getTime() - valueA.getTime();
                    }

                    if (valueA < valueB) {
                        return ascending ? -1 : 1;
                    }
                    if (valueA > valueB) {
                        return ascending ? 1 : -1;
                    }
                }
                return 0;
            });
        }
    }

    // Filter the view by a specified field and value or regex pattern
    filterView(field: string, valueOrPattern: any): void {
        this.currentFilter = { field, valueOrPattern };
        this.applyFilter();
    }

    private applyFilter(): void {
        if (this.currentFilter) {
            const { field, valueOrPattern } = this.currentFilter;
            const records = this.database.getAllRecords();
            if (valueOrPattern instanceof RegExp) {
                this.view = Int32Array.from(
                    records
                        .map((record, index) => ({ record, index }))
                        .filter(({ record }) => valueOrPattern.test(record[field] as string))
                        .map(({ index }) => index)
                );
            } else {
                this.view = Int32Array.from(
                    records
                        .map((record, index) => ({ record, index }))
                        .filter(({ record }) => record[field] === valueOrPattern)
                        .map(({ index }) => index)
                );
            }
        }
    }

    // Handle database change event
    private handleDatabaseChange(): void {
        this.initializeView();
        if (this.currentFilter) {
            this.applyFilter();
        }
        if (this.currentSort) {
            this.applySort();
        }
    }

    // Advanced filtering similar to LokiJS
    advancedFilterView(filter: (record: Record) => boolean): void {
        const records = this.database.getAllRecords();
        this.view = Int32Array.from(
            records
                .map((record, index) => ({ record, index }))
                .filter(({ record }) => filter(record))
                .map(({ index }) => index)
        );
    }

    // Clear all filters and reset the view to include all records
    clearFilter(): void {
        this.currentFilter = null;
        this.initializeView();
        if (this.currentSort) {
            this.applySort();
        }
    }

    // Get the records in the view
    getViewRecords(): Record[] {
        return Array.from(this.view).map(index => this.database.getRecordByIndex(index)).filter(record => record !== null) as Record[];
    }

    // Get the number of records in the view
    getRecordCount(): number {
        return this.view.length;
    }

    // Get a record by its index in the view
    getRecordByIndex(index: number): Record | null {
        if (index >= 0 && index < this.view.length) {
            return this.database.getRecordByIndex(this.view[index]);
        }
        return null;
    }

    // Get a record by its ID in the view
    getRecordById(id: RecordID): Record | null {
        const recordIndex = this.database.getAllRecords().findIndex(record => record.id === id);
        if (recordIndex !== -1 && this.view.includes(recordIndex)) {
            return this.database.getRecordByIndex(recordIndex);
        }
        return null;
    }
}

// RemoteDataLoader class
class RemoteDataLoader {
    private database: MemoryDatabase;
    private url: string;

    constructor(database: MemoryDatabase, url: string) {
        this.database = database;
        this.url = url;
    }

    // Fetch records from the given URL and add them to the database
    async fetchRecords(): Promise<void> {
        try {
            const response = await fetch(this.url);
            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Response is not an array');
            }

            data.forEach(item => {
                const record = this.database.model.createRecord(item, true);
                this.database.addRecord(record);
            });

            this.database.emit('dataLoaded');
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    }
}

// Example usage
const userModel = new Model({
    name: { type: 'string', minLength: 3, maxLength: 50, required: true },
    age: { type: 'number', min: 0, max: 120, required: true },
    isActive: { type: 'boolean', required: true },
    email: { type: 'string', format: 'email', required: true }
});

const db = new MemoryDatabase(userModel);
const remoteDataLoader = new RemoteDataLoader(db, 'https://api.example.com/users');

remoteDataLoader.fetchRecords().then(() => {
    const dataView = new DataView(db);
    dataView.initializeView();
    console.log(dataView.getViewRecords());
});