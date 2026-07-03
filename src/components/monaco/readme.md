# using monaco in x4

you must copy ./bin/* in your destination folder ex. monaco folder 




fr x4build update your package.json this this

{
    ...
    "x4build": {
		"copy": [
            {   "from": "./node_modules/x4js/src/components/monaco/bin",     "to": "monaco" }
		]
	}
    ...
}