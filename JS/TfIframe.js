export class tfIframe {
  constructor(element = null) {
    this.frame = element;
  }
  MenuSwitch(event, source) {
    switch (source.src) {
      case "homepage.html":
      case "https://tsunamiflow.club/homepage.html":
      case "https://www.tsunamiflow.club/homepage.html":
        console.log("iframe message received from the homepage");
        console.log("The event type is " + event.data.type);
        if (event.data.type === "Website Updates") {
          console.log("creating the json to send to the iframe");
          let HomePageJson = {
            type: "start_updates",
            info: HomepageUpdates.toJSON(),
            message: "Starting the game",
            username: "Mishuba",
            error: "Nothing as of now"
          };
          console.log("sending the iframe message");
          source.contentWindow.postMessage(HomePageJson, "https://tsunamiflow.club/homepage.html");
        } else {
          
        }
        console.log("the end of that");
        break;
      case "roster.html":
      case "https://tsunamiflow.club/roster.html":
      case "https://www.tsunamiflow.club/roster.html":
        console.log("The iframe is from the roster page");
        let RosterJson = {
          type: "roster",
          info: "idk roster",
          message: "this is the roster message",
          username: "Mishuba",
          error: "ok no errors for the roster right now"
        };
        source.contentWindow.postMessage(RosterJson, "https://tsunamiflow.club/roster.html");
        break;
      case "news.html":
      case "https://tsunamiflow.club/news.html":
      case "https://www.tsunamiflow.club/news.html":
        console.log("The iframe is from the news page");
        let NewsJson = {
          type: "live",
          info: "live stream",
          message: "this is the live stream message",
          username: "Mishuba",
          error: "ok no errors for community right now"
        }
        source.contentWindow.postMessage(NewsJson, "https://tsunamiflow.club/news.html");
        break;
      case "Competitions.html":
      case "https://tsunamiflow.club/Competitions.html":
      case "https://www.tsunamiflow.club/Competitions.html":
        console.log("iframe competition message received");
        let CompetitionJson;
        console.log("checking the data type of the competitions iframe which is " + event.data.type);
        if (event.data.type === "start_game") {
          console.log("sending the game data over now");
          CompetitionJson = {
            type: "game_begin",
            info: FirstGame.toJSON(),
            message: "start the first game once the page opens.",
            username: "Mishuba",
            error: "Nothing for competitions right now"
          };
          
          source.contentWindow.postMessage(CompetitionJson, "https://tsunamiflow.club/Competitions.html");
        } else if (event.data.type === "game") {
          CompetitionJson = {
            type: "game",
            info: FirstGame.toJSON(),
            message: "this will be the first game message i send from outside of the game for some reason and to the game maybe",
            username: "Mishuba",
            error: "No errors as of now."
          };
          
          source.contentWindow.postMessage(CompetitionJson, "https://tsunamiflow.club/Competitions.html");
        } else {
          
        }
        break;
      case "TFnetwork.html":
      case "https://tsunamiflow.club/TFnetwork.html":
      case "https://www.tsunamiflow.club/TFnetwork.html":
        console.log("The iframe is from the TFnetwork page");
        let TfNetworkJson = {
          type: "network",
          info: "idk network",
          message: "this is the network message",
          username: "Mishuba",
          error: "ok no errors for network right now"
        };
        source.contentWindow.postMessage(TfNetworkJson, "https:/tsunamiflow.club/TFnetwork.html");
        break;
      case "Community.html":
      case "https://tsunamiflow.club/Community.html":
      case "https://www.tsunamiflow.club/Community.html":
        console.log("iframe commmunity message received");
        let CommunityJson = {
          type: "community",
          info: "idk community",
          message: "this is the community message",
          username: "Mishuba",
          error: "ok no errors for community right now"
        };
        
        source.contentWindow.postMessage(CommunityJson, "https://tsunamiflow.club/Community.html");
        break;
      default:
        console.log("The iframe is from the default page " + source.src);
        console.log("The event information is " + event);
        break;
    };
  }
  TfNetwork() {
    //youtube
    
    //twitch
    
    //live
    
    //pateron
    
    //onlyfans
    
    //etc
  }
}