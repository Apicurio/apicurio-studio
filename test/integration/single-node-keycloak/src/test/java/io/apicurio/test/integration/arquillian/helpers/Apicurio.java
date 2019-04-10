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
