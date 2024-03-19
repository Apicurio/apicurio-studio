package io.apicurio.studio;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.annotations.QuarkusMain;

/**
 * @author eric.wittmann@gmail.com
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@QuarkusMain(name = "StudioQuarkusMain")
public class StudioQuarkusMain {

    public static void main(String... args) {
        Quarkus.run(args);
    }
}
