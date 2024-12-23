import { CSSResult, HTMLTemplateResult, LitElement, css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Task } from "@lit/task";

// maybe disable until sound is loaded?

/**
 * A simple inline audio component. This uses an HTML Audio element internally, so the audio element events should bubble up through this component. It doesn't handle wrapping well. It is designed for shorter audio clips.
 *
 * @element sound-bite
 *
 * @prop src - the audio file source. This is required.
 * @prop name - The name of the sound. This will be used as the default content of the element as well as the aria-label.
 * @prop prefetchStrategy - When to load the audio file. If the file is not loaded, clicking will have no effect. Hover will load the audio when the user hovers over the element (this could be risky if the sound is large and can't be loaded before clicked). Intersection will load the audio when the element is 50% visible in the viewport. Load will load the audio as soon as the element is connected. Defaults to intersection.
 * @prop audioState - Don't give audioState a default value. (If it is manually set to "playing", the css anim tries to run  when the sound isn't loaded which causes issues.)
 *
 * @slot - The default slot has the name of the sound by default (from the name attribute).
 * @slot pause-icon - This slot will be shown when the sound is playing. Defaults to the pause emoji, ⏸️.
 * @slot play-icon - This slot will be shown when the sound is paused. Defaults to the play emoji, ▶️.
 *
 * @cssprop [--bg-block-offset=0lh] - The block offset of the background.
 * @cssprop [--bg-color=grey] - The background color of the soundbite.
 * @cssprop [--bg-height=1lh] - The height of the background.
 * @cssprop [--initial-bg-inline-size=0.5ch] - The initial background inline size.
 * @cssprop [--initial-bg-block-size=var(--bg-height)] - The initial background block size.
 * @cssprop [--initial-padding=0.3ch] - The padding between the initial background and the icon/text.
 * @cssprop [--focus-outline=2px solid currentColor] - The focus outline.
 * @cssprop [--focus-outline-offset=2px] - The focus outline offset.
 */
// I don't want to call define in the main file bc that causes problems when importing server side
// if the user manually seeks the audio it'll mess up a bit prob also if they play/pause it
export class SoundBite extends LitElement {
  // src and name aren't reactive (I think IDK)
  @property({ type: String })
  src: string = "";
  @property({ type: String })
  name: string = "";
  // click isn't supported since I can't have the sound play after it's loaded very easily
  // hover could be risky if the sound is large
  // clicks will have no effect if the sound is not loaded

  @property({ type: String })
  prefetchStrategy: "hover" | "intersection" | "load" = "intersection";
  // don't give audioState a default value bc problems (tries to run the css anim when the sound isn't loaded) happen (paused is prob ok)
  @property({ type: String, reflect: true })
  // * In addition to the audioState on the sound-bite element, the button has the audio-state attribute which has the same value
  // * This is bc I'm lazy and don't want to break out of my nesting to adjust the button styles based on the audio state
  audioState: "playing" | "paused" = "paused";

  @state()
  protected _audio: HTMLAudioElement | null = null;
  @state()
  protected _duration: number | null = null;
  @state()
  protected _loadAudio = false;

  protected _playIcon = "▶️";
  protected _pauseIcon = "⏸️";
  protected _observer: IntersectionObserver | null = null;

  // pretty sure that the audio events should bubble up without needing to do anything
  // shouldn't need to run manually since should run when src changes (which should include the first time it's set)
  // @ts-expect-error - Lit runs this automatically
  private _setupAudioTask = new Task(this, {
    task: async ([src, _loadAudio], { signal }) => {
      // this prevents the audio from loading before it's supposed to since this task will run whenever one of the args changes
      if (!_loadAudio) return;
      this._audio = new Audio(src);
      if (!this._audio) return;
      this._duration = await new Promise((resolve) => {
        if (!this._audio) return;
        this._audio.addEventListener(
          "loadedmetadata",
          () => {
            if (!this._audio) return;
            resolve(this._audio.duration);
          },
          { signal }
        );
      });
      this._audio.addEventListener("ended", () => {
        this.audioState = "paused";
      });
    },
    // the as const helps ts infer the type correctly
    args: () => [this.src, this._loadAudio] as const,
  });

  private _onClick() {
    if (!this._audio || !this._duration) return;
    if (this.audioState === "playing") {
      this._audio.pause();
      this.audioState = "paused";
    } else {
      this._audio.play();
      this.audioState = "playing";
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    // make sure that the animation doesn't start
    this.audioState = "paused";
    if (this.prefetchStrategy === "intersection") {
      this._observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            this._loadAudio = true;
            this._observer?.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      this._observer.observe(this);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._observer?.disconnect();
  }

  static styles: CSSResult = css`
    @keyframes scale-in-x {
      from {
        scale: 0 1;
      }

      to {
        scale: 1 1;
      }
    }

    /**
    * [1] - sets the block offset of the bg
    * [2] - sets the initial bg size
    * [3] - sets the padding between the initial bg and the icon/text
    * TODO test text wrapping
    * * the props need a unit to be valid in calcs
    */

    .soundbite {
      --_bg-block-offset: var(--bg-block-offset, 0lh); /* [1] */
      --_bg-color: var(--bg-color, grey);
      --_bg-height: var(--bg-height, 1lh);
      --_initial-bg-inline-size: var(--initial-bg-inline-size, 0.5ch); /* [2] */
      --_initial-bg-block-size: var(
        --initial-bg-block-size,
        var(--_bg-height)
      ); /* [2] */
      --_initial-padding: var(--initial-padding, 0.3ch); /* [3] */
      --_focus-outline: var(--focus-outline, 2px solid currentColor);
      --_focus-outline-offset: var(--focus-outline-offset, 2px);

      position: relative;
      display: inline-block;
      block-size: 1lh;
      padding: 0;
      padding-inline-start: var(
        --_initial-padding,
        var(--_initial-bg-inline-size, 0ch)
      );
      border: transparent;
      margin: 0;
      background-color: unset;
      font: inherit;
      isolation: isolate;

      &:focus-visible {
        outline: var(--_focus-outline);
        outline-offset: var(--_focus-outline-offset);
      }

      &::before,
      &::after {
        position: absolute;
        z-index: -1;
        inset-block-end: var(--_bg-block-offset);
        background-color: var(--_bg-color);
        content: "";
      }

      /**
      * the playing-bg, animates to show progress of sound when playing
      * is this ok for prefers-reduced-motion? 
      * [1] - offset the initial bg position so that it doesn't look like nothing is moving for part of the animation
              (1px helps with gaps) 
      */
      &::before {
        inset-inline-start: calc(
          var(--_initial-bg-inline-size) - 1px
        ); /* [1] */
        inset-inline-end: 0;
        block-size: var(--_bg-height);
        scale: 0 1;
        transform-origin: left center;
      }

      /**
      * the initial bg
      * faking the initial bg makes it easier to keep the size of this initial bg the same no matter the text length 
      * [1] - make sure it connects to the playing bg if the playing bg is offset
      */
      &::after {
        position: absolute;
        z-index: -1;
        inset-block-end: 0;
        inset-inline-start: 0;
        inline-size: var(--_initial-bg-inline-size);
        block-size: var(--_initial-bg-block-size); /* [1] */
      }

      /* applying the animation here lets it restart with every press and only play once */
      &[audio-state="playing"]::before,
      &[audio-state="paused"]::before {
        animation: scale-in-x var(--sound-duration) linear 1;
      }

      &[audio-state="playing"] {
        &::before {
          animation-play-state: running;
        }
      }

      &[audio-state="paused"] {
        &::before {
          animation-play-state: paused;
        }
      }
    }
  `;

  constructor() {
    super();
    // This should probably be in the connected callback or is the constructor ok?
    if (this.prefetchStrategy === "load") {
      this._loadAudio = true;
    } else if (this.prefetchStrategy === "hover") {
      this.addEventListener(
        "pointerenter",
        () => {
          this._loadAudio = true;
        },
        { once: true }
      );
    }
    // click will be handled in the _onClick
    // intersection will be handled in the connectedCallback and the disconnectedCallback
  }

  protected _getCurrentIcon(): HTMLTemplateResult {
    if (this.audioState === "playing") {
      return html`<slot name="pause-icon">${this._pauseIcon}</slot>`;
    } else {
      return html`<slot name="play-icon">${this._playIcon}</slot>`;
    }
  }

  // I don't think the label change is read aloud by screen readers so I'm going to change the label to say play/pause
  // getAriaLabel(): string {
  //   if (this.audioState === "playing") {
  //     return `Pause sound ${this.name}`;
  //   } else {
  //     return `Play sound ${this.name}`;
  //   }
  // }

  render() {
    return html`<button
      aria-label="Play or pause ${this.name ||
      "the sound"} duration: ${this._duration?.toFixed(1) || "loading"} seconds"
      class="soundbite"
      style="${`--sound-duration: ${this._duration?.toFixed(1)}s;`}"
      audio-state="${this.audioState}"
      @click="${this._onClick}"
    >
      ${this._getCurrentIcon()}<slot>${this.name}</slot>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sound-bite": SoundBite;
  }
}

window.customElements.define("sound-bite", SoundBite);
