/*
 * Copyright 2019 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.apicurio.test.integration.arquillian.helpers;

import com.codeborne.selenide.Selenide;

import static com.codeborne.selenide.Selectors.byText;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.open;


public class Apicurio {

    private String baseUrl;

    public Apicurio(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public void register() {
        open(baseUrl + "/studio");
        Selenide.screenshot("screen-apicurio-0001");

        $(byText("Register")).click();

        $("#firstName").setValue("test");
        $("#lastName").setValue("test");
        $("#email").setValue("test@example.com");
        $("#password").setValue("test");
        $("#password-confirm").setValue("test").pressEnter();
    }
}
