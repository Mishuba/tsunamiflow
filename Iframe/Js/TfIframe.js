export class tfIframe {
  pageName = null;
  constructor(element = null, Homepage = null, Game1 = null, video = null) {
    this.frame = element;
    this.HomepageUpdates = Homepage;
    this.FirstGame = Game1;
  }

  getPageName(source) {
    try {
      const url = new URL(source.src, window.location.href);
      const name = url.pathname.split("/").pop();
      let page = (name || "").toLowerCase();
      console.log(`the iframe page: ${page}`);
      return page;

    } catch (err) {
      return "";
    }
  }

  getPostMessageOrigin(pageName) {
    // Use the same domain origin for all known pages
    return "https://tsunamiflow.club";
  }

  doIframeThing(event, source) {
    this.pageName = this.getPageName(source);
    const origin = this.getPostMessageOrigin(this.pageName);
    console.log(`Determined postMessage origin: ${origin}`);
    switch (this.pageName) {
      case "homepage.html":
        console.log("iframe message received from the homepage");
        console.log("The event type is " + event.data.type);
        if (event.data.type === "Website Updates") {
          console.log("creating the json to send to the iframe");
          let HomePageJson = {
            type: "start_updates",
            info: this.HomepageUpdates.toJSON(),
            message: "Starting the game",
            username: "Mishuba",
            error: "Nothing as of now"
          };
          console.log("sending the iframe message");
          source.contentWindow.postMessage(HomePageJson, origin);
        }
        console.log("the end of that");
        break;
      case "Iframe/Pages/roster.html":
        console.log("The iframe is from the roster page");
        let RosterJson = {
          type: "roster",
          info: "idk roster",
          message: "this is the roster message",
          username: "Mishuba",
          error: "ok no errors for the roster right now"
        };
        source.contentWindow.postMessage(RosterJson, origin);
        break;
      case "Iframe/Pages/news.html":
        console.log("The iframe is from the news page");
        let NewsJson = {
          type: "live",
          info: "live stream",
          message: "this is the live stream message",
          username: "Mishuba",
          error: "ok no errors for community right now"
        };
        source.contentWindow.postMessage(NewsJson, origin);
        break;
      case "Iframe/Pages/competitions.html":
        console.log("iframe competition message received");
        let CompetitionJson;
        console.log("checking the data type of the competitions iframe which is " + event.data.type);
        if (event.data.type === "start_game") {
          console.log("sending the game data over now");
          CompetitionJson = {
            type: "game_begin",
            info: this.FirstGame.toJSON(),
            message: "start the first game once the page opens.",
            username: "Mishuba",
            error: "Nothing for competitions right now"
          };
          source.contentWindow.postMessage(CompetitionJson, origin);
        } else if (event.data.type === "game") {
          CompetitionJson = {
            type: "game",
            info: this.FirstGame.toJSON(),
            message: "this will be the first game message i send from outside of the game for some reason and to the game maybe",
            username: "Mishuba",
            error: "No errors as of now."
          };
          source.contentWindow.postMessage(CompetitionJson, origin);
        }
        break;
      case "Iframe/Pages/tfnetwork.html":
        console.log("The iframe is from the TFnetwork page");
        let TfNetworkJson = {
          type: "network",
          info: "idk network",
          message: "this is the network message",
          username: "Mishuba",
          error: "ok no errors for network right now"
        };
        source.contentWindow.postMessage(TfNetworkJson, origin);
        break;
      case "Iframe/Pages/community.html":
        console.log("iframe community message received");
        let CommunityJson = {
          type: "community",
          info: "this.Video.toJson,",
          message: "this is the community message",
          username: "",
          error: "ok no errors for community right now"
        };
        source.contentWindow.postMessage(CommunityJson, origin);
        break;
      default:
        console.log("The iframe is from the default page " + source.src);
        console.log("The event information is " + event);
        break;
    };
  }
  checkIframeOrigin(event, source) {
    console.log("the iframe origin is " + event.origin)
    console.log("the iframe source is " + source)
    switch (event.origin) {
      case "https://www.tsunamiflow.club":
      case "https://tsunamiflow.club":
        this.doIframeThing(event, source);
        break;
      case "https://world.tsunamiflow.club":

        break;
      case "https://m.stripe.com":

        break;
      default:
        console.log(event.origin);
        break;
    };
  };
  MenuSwitch(source) {
    console.log("starting the main page navigation system.");
    console.log("checking the iframe source");

    console.log("creating and using the add event listener");
    this.pageName = this.getPageName(source);
    const allowedPages = [
      "homepage.html",
      "Iframe/Pages/roster.html",
      "Iframe/Pages/news.html",
      "Iframe/Pages/competitions.html",
      "Iframe/Pages/tfnetwork.html",
      "Iframe/Pages/community.html"
    ];

    if (allowedPages.includes(pageName)) {
      console.log(`The iframe is from the ${pageName} page`);
      window.addEventListener("message", async (event) => {
        this.checkIframeOrigin(event, source);
      });
    } else {
      console.log(`Some outside source is trying to send my homepage a message. the source origin is ${source.origin}`);
    }
  }
}