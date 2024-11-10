import { print, printCenterd } from "../utils/io.mjs";

function createInnBetweenScreen() {
    return {
        isDrawn: false,
        next: null,
        transitionTo: null,
        displayTime: 0,
        text: null,
        transitionFn: null,

        init: function (text, transitionFn, displayTime = 3) {
            this.displayTime = displayTime * 1000;
            this.text = text;
            this.transitionFn = transitionFn;
        },

        update: function (dt) {

            this.displayTime -= dt;
            if (this.displayTime <= 0) {
                this.next = this.transitionFn();
                this.transitionTo = "Transitioning away from innbetween screen"
            }
        },

        draw: function (dr) {
            if (this.isDrawn == false) {
                this.isDrawn = true;
                printCenterd(this.text);
            }
        }
    }
}

export default createInnBetweenScreen;