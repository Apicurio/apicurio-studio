/*
 * Copyright 2017 JBoss Inc
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

package io.apicurio.test.core;

import java.lang.reflect.Field;

/**
 * @author eric.wittmann@gmail.com
 */
public class TestUtil {
    
    /**
     * Sets the value of a private field on a target object.
     * @param target
     * @param fieldName
     * @param fieldValue
     */
    public static void setPrivateField(Object target, String fieldName, Object fieldValue) {
        try {
            Field field = findField(target, fieldName);
            field.setAccessible(true);
            field.set(target, fieldValue);
        } catch (NoSuchFieldException | SecurityException | IllegalArgumentException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Finds a field with the given name.
     * @param target
     * @param fieldName
     * @throws NoSuchFieldException
     */
    private static Field findField(Object target, String fieldName) throws NoSuchFieldException {
        Class<?> targetClass = target.getClass();
        while (targetClass != Object.class) {
            try {
                Field field = targetClass.getDeclaredField(fieldName);
                return field;
            } catch (NoSuchFieldException e) {
                targetClass = targetClass.getSuperclass();
            }
        }
        throw new NoSuchFieldException();
    }

}
