package io.apicurio.test.integration.arquillian.helpers;

import com.codeborne.selenide.Configuration;

import static com.codeborne.selenide.Selectors.byText;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.open;


public class Selenide {

    private static final IntegrationTestProperties properties = new IntegrationTestProperties();

    public static void init() {
        Configuration.reportsFolder = properties.get("selenide.reports.dir");
        Configuration.browser = "firefox";
        Configuration.headless = true;
    }
}
