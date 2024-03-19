import {DropDownOptionValue} from "../_components/common/drop-down.component";

export class SchemaUtil {


    public static readonly schemaFormatOptions = [
            new DropDownOptionValue("application/vnd.aai.asyncapi;version=2.0.0", "application/vnd.aai.asyncapi;version=2.0.0"),
            new DropDownOptionValue("application/vnd.oai.openapi;version=3.0.0", "application/vnd.oai.openapi;version=3.0.0"),
            new DropDownOptionValue("application/application/schema+json;version=draft-07", "application/application/schema+json;version=draft-07"),
            new DropDownOptionValue("application/application/schema+yaml;version=draft-07", "application/application/schema+yaml;version=draft-07"),
            new DropDownOptionValue("application/vnd.apache.avro;version=1.9.0", "application/vnd.apache.avro;version=1.9.0")
        ];

}
