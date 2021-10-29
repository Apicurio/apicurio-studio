import {DropDownOptionValue as Value} from "../../../../../components/common/drop-down.component";

/**
 * @author vvilerio
 */
export class SchemaUtil {


    public static readonly schemaFormatOptions = [
            new Value("application/vnd.aai.asyncapi;version=2.0.0", "application/vnd.aai.asyncapi;version=2.0.0"),
            new Value("application/vnd.oai.openapi;version=3.0.0", "application/vnd.oai.openapi;version=3.0.0"),
            new Value("application/application/schema+json;version=draft-07", "application/application/schema+json;version=draft-07"),
            new Value("application/application/schema+yaml;version=draft-07", "application/application/schema+yaml;version=draft-07"),
            new Value("application/vnd.apache.avro;version=1.9.0", "application/vnd.apache.avro;version=1.9.0")
        ];

}