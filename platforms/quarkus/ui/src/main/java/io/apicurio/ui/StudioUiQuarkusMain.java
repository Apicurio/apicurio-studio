package io.apicurio.ui;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.annotations.QuarkusMain;

/**
 * @author carles.arnal@redhat.com
 */
@QuarkusMain
public class StudioUiQuarkusMain {
    public static void main(String... args) {
        Quarkus.run(args);
    }
}