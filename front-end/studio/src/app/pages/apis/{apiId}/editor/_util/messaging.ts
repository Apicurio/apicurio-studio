/**
 * @license
 * Copyright 2019 Red Hat
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

export interface TopicOptions {
    distinctUntilChanged?: boolean;
}

/**
 * A subscription to a topic.  Used to unsubscribe.
 */
export class TopicSubscription<T> {

    /**
     * C'tor.
     * @param topic
     * @param subscriber
     */
    constructor(private topic: Topic<T>, private subscriber: TopicSubscriber<T>) {}

    /**
     * Called to unsubscribe from the topic.  The consumer will no longer receive any messages/values.
     */
    public unsubscribe(): void {
        this.topic.unsubscribe(this.subscriber);
    }

}


/**
 * A subscriber.
 */
export class TopicSubscriber<T> {

    constructor(private callback: (value: T) => void) {}

    /**
     * Sends a value to this subscriber.
     * @param value
     */
    public send(value: T): void {
        this.callback(value);
    }

}


/**
 * A simple class that handles pub-sub with multiple consumers and multiple producers.  This differs from
 * an rxjs Subject/Observable in that subscribers are not sent the "current" value of the Topic when they
 * first subscribe.  Consumers are only notified of a value when that value is sent.  This, of course, leads
 * to the problem that a consumer must make sure to subscribe to the Topic before a producer sends a value.
 */
export class Topic<T> {

    private subscribers: TopicSubscriber<T>[] = [];
    private currentValue: T;

    constructor(private options: TopicOptions = {}) {}

    /**
     * Gets the current value in the topic.
     */
    public getValue(): T {
        return this.currentValue;
    }

    /**
     * Send a value to all subscribers/consumers of the topic.
     * @param value
     */
    public send(value: T): void {
        if (this.options.distinctUntilChanged && this.currentValue === value) {
            return;
        }

        this.subscribers.forEach( subscriber => {
            subscriber.send(value);
        });
        this.currentValue = value;
    }

    /**
     * Called by a consumer to subscribe to the topic.  Returns a subscription that can be used to
     * unsubscribe.
     * @param next
     */
    public subscribe(next: (value: T) => void): TopicSubscription<T> {
        let subscriber: TopicSubscriber<T> = new TopicSubscriber<T>(next);
        this.subscribers.push(subscriber);
        let subscription: TopicSubscription<T> = new TopicSubscription<T>(this, subscriber);
        return subscription;
    }

    /**
     * Called to remove a subscriber from the list of current subscribers.
     * @param subscriber
     */
    unsubscribe(subscriber: TopicSubscriber<T>): void {
        let idx: number = this.subscribers.indexOf(subscriber);
        if (idx !== -1) {
            this.subscribers.splice(idx, 1);
        }
    }

}