// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/video-player/video-player.js";
import "./tv-channel.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.activeItem = {
      title: null,
      id: null,
      description: null,
    };
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      activeItem: { type: Object }
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: block;
        margin: 16px;
        padding: 16px;
      }
      .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      .left-item {
        grid-column: 1;
        margin-top: 50px;
        width: 900px;
        height: 400px;
      }

      .right-item {
        grid-column: 2;
        width: 150px;
        text-align: center;
        margin-left: 100px;
        margin-top: 30px;
        height: 90vh;
        overflow-y: auto;
      }

      .button-wrapper{
        display: flex;
        gap: 500px;
      }

      .next-button {
        font-size: 20px;
        height: 50px;
        width: 200px;
      }
      .previous-button {
        font-size: 20px;
        height: 50px;
        width: 200px;
      }

      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class ="container">
        <div class ="grid-item">
          <div class = "left-item">
                 <!-- video -->
          <video-player 
          source="https://www.youtube.com/watch?v=B9s5zRrDCYo&ab_channel=RedLeopardVideos" accent-color="red" dark track="https://haxtheweb.org/files/HAXshort.vtt">
        </video-player>
        <tv-channel title="Top 10 Pikmin Bosses" presenter="RedLeopardVideos">
        The boss fights in the Pikmin series are classics. Today I want to spend sometime celebrating how great these bosses are by counting down my Top 10 Favorite Pikmin Bosses. Remember, this is my opinion, so don't get too mad if one of your favorite bosses doesn't appear on my list. I hope that you enjoy this video!
  </tv-channel>
    </div>
  </div>
    <div class = "right-item">
      <h2>${this.name}</h2>
      ${
        this.listings.map(
          (item) => html`
            <tv-channel
              id="${item.id}"
              title="${item.title}"
              presenter="${item.metadata.author}"
              description="${item.description}"
              @click="${this.itemClick}"
              timecode = "${item.metadata.timecode}"
            >
            </tv-channel>

          `
        )
      }
      <div>
      ${this.activeItem.name}
      ${this.activeItem.description}

        <!-- discord / chat - optional -->
      </div>
    </div>
    </div>
    
      <!-- dialog -->
      <sl-dialog label="Dialog" class="dialog">
      ${this.activeItem.title}
        <sl-button slot="footer" variant="primary" @click="${this.closeDialog}">Close</sl-button>
      </sl-dialog>

      <div class = "button-wrapper">
        <button class = "previous-button"> Previous Slide </button>
        <button class = "next-button"> Next Slide </button>
    </div>
    `;
  }

  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  itemClick(e) {
    console.log(e.target);
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play()
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(e.target.timecode)
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
        console.log(this.listings);
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);