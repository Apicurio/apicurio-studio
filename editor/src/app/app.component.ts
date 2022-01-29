import { Component } from "@angular/core";
import {ApiDefinition} from "apicurio-design-studio";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "studio-editor";
  api: ApiDefinition;

  constructor() {
      const content: any = JSON.parse(`
        {
            "openapi": "3.0.2",
            "info": {
                "title": "Blank API",
                "version": "1.0.0"
            }
        }`);
      this.api = new ApiDefinition();
      this.api.createdBy = "user";
      this.api.createdOn = new Date();
      this.api.tags = [];
      this.api.description = "";
      this.api.id = "api-1";
      this.api.spec = content;
      this.api.type = "OpenAPI30";
      if (content && content.swagger && content.swagger == "2.0") {
          this.api.type = "OpenAPI20";
      }
  }

}
