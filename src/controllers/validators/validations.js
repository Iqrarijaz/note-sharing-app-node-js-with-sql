import Ajv from "ajv";
import schema from "./schema.json" assert { type: "json" };

const ajv = new Ajv({ allErrors: true, useDefaults: true, strict: false });

function getValidator(schemaName) {
    if (!ajv.getSchema(schemaName)) {
        ajv.addSchema(schema[schemaName], schemaName);
    }
    return ajv.getSchema(schemaName);
}

export const verifySchema = (schemaName, data) => {
    const validate = getValidator(schemaName);
    if (!validate) {
        return { success: false, message: `Schema ${schemaName} not found` };
    }

    const valid = validate(data);
    if (!valid) {
        const messages = validate.errors.map((err) => `${err.instancePath || "/"} ${err.message}`);
        return { success: false, message: messages };
    }

    return { success: true, message: "Validation passed" };
};
