<?php
define("TfEmailFr", "mishuba@tsunamiflow.club");
//weather
define("tfWeatherUrl", "https://api.weatherapi.com/v1");
define("tfWeatherKey", "cf5a64c9095e425ab0f52816230110");
define("tfWeatherApi", "/current.json");
//Weather Ends

//Database (Community)
define('tfHostname', '');
define('tfDatabaseName', '');
define('tfDbUsername', '');
define('tfDbPassword', '');
//Database Ends

//Github (Css Javascript)

//Github Ends

//Tsunami 
//Amazon AWS EC2 Server Webhook
define("TfWebhook", "https://world.tsunamiflow.club/webhook.php");
define("TfStripeWebhook", "https://world.tsunamiflow.club/stripewebhook.com");
define("tfWeather", "https://world.tsunamiflow.club/weatherwebhook.php");
define("TprintfulFwebhook", "https://world.tsunamiflow.club/printfulwebhook.php");
define("tfStripeEndpointUrl", "");
//Amazon AWS EC2 Server Websocket
define("TsunamiFlowWebSocket", "wss://world.tsunamiflow.club/websocket");
define("TfWs", "ws://world.tsunamiflow.club:8080");
//Websocket Ends
//Amazon AWS EC2 Server RTMP
define("tfRtmpServer", "rtmp://world.tsunamiflow.club/live");
define('TsunamiFlowStreamKey', 'anything');
define('TsunamiFlowStreamLink', 'world.tsunamiflow.club/live/');
define('EVBRTOken', '');
//Amazon AWS EC2 Server Ends
//Amazon AWS S3 Storage Bucket (world.tsunamilow.club Database.)

//AWS S3 Storage Bucket Ends
//Amazon Ends

//Cloudflare 
//Cloudflare Turn Server 
define("tfTurnServerTF", "Tsunami Flow");
define('tfTurnServerTFId', "4f06ad24081b3e17521691d840e0cd58");
define("tfTurnServerUrl", "https://rtc.live.cloudflare.com/v1");
define("tfTurnServerUrl2", "turn:turn.cloudflare.com:3478?transport=udp");
define("tfTurnServerUrl3", "turn:turn.cloudflare.com:3478?transport=tcp");
define("tfTurnServerUrl4", "turns:turn.cloudflare.com:5349?transport=tcp");
define("tfTurnServerTFAppSecret", "e3a8530b7b0839ec24b526fb44098cbd667c5a9b1689a4e878e810eac0997792");
define("tfTurnServerCommunity", "TsunamiCommunity");
define("tfTurnSeverTokenId", "8821db82aa7499bbff6e4e694bfa08a8");
define("tfTurnServerApiToken", "1adac78d1efe9dc1d3315af466fadf0b62e0a1ab565bf3aaca88b26718ac2a04");
define("tfCloudflareScript", '<script src="https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/8.1.2/adapter.min.js" integrity="sha512-l40eBFtXx+ve5RryIELC3y6/OM6Nu89mLGQd7fg1C93tN6XrkC3supb+/YiD/Y+B8P37kdJjtG1MT1kOO2VzxA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>');
define("tfTurnServerAppSecret", "e3a8530b7b0839ec24b526fb44098cbd667c5a9b1689a4e878e810eac0997792");
define("tfTurnServerAppId", "4f06ad24081b3e17521691d840e0cd58");
define("tfTurnServerDestinationId", "we_1Qwn7iJ0hwDancvFhnJtK4RE");
//Cloudflare Stun Server
define("tfStunServerUrl", "stun:stun.cloudflare.com:3478");
//Cloudflare Turn/Stun Server Ends
//Cloudflare R2 Storage Bucket (mp3)
define("ClR2Name", "tsunami-radio");
define("ClR2Location", "Eastern North America");
define("ClR2LocationApprevation", "ENAM");
define("ClR2S3Api", "https://ac47c31c7548ac580a0b4caaed91d41f.r2.cloudflarestorage.com/tsunami-radio");
//Cloudflare R2 Storage Bucket Ends
//Cloudflare Ends

//Stripe
//api
define("TfStripePublishableKey", "pk_live_51QZZxBJ0hwDancvFBcewuqPvIOqZ0uDjebhD5VXXoIlUtMtprhG2xr54Mtq1Tn1z1110WUiJIgiTJVJ0nXsud1gU00DenEjLRt");
define('TfStripeSecretKey', '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');
//Endpoint Secret 
define("TfStrieWebhookApiSecretKey", "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");
define("tfStripeSigningSecret", "whsec_UM84XeJDVrM2hvrrgNHh6tgXQiXWzBOO"); // or BOO
//Destination ID
define("tfStripeDestinationId", "we_1Rrpc72ema1J6fUtrPHuZkG6");
//Stripe Ends 

//Tumblr https://www.tumblr.com/developers
define('TumblrStreamSecretKey', 'TATFxHwCsqjvC9Aj2nD6KumIzAb8bJIA7dRlarI5Edmgrg9RCy');
define('TumblrOAuthConsumerKey', '8RgnfQ4CMQMsETtBmrbNsxBDGdB70yrLfSceiRiO0J7hGEes9S');
define('TumblrStreamLink', '');
define('AuthorizeURL', 'https://www.tumblr.com/oauth/authorize');
define('TumblrAccessTokenURL', 'https://www.tumblr.com/oauth/access_token');
define('TumblrRequestTokenURL', 'https://www.tumblr.com/oauth/request_token');
define('TumblrApplicationName', 'TsunamiFlowClub');
define('TumblrApplicationWebsite', 'http://www.tsunamiflow.club/Application');
define('TumblrDefaultCallbackURL', 'https://www.tsunamiflow.club/');
define('TumblrOAuth2RedirectURLS', 'https://www.tsunamiflow.club/Application/Authorize');
//Tumblr Ends

//Twitch https://dev.twitch.tv/docs/api/ dev.twitch.tv
define('TwitchStreamKey', 'live_166160210_ZHhBDWe1EEdfcgna30jo7srMmhWIiF');
define('TwitchStreamLink', 'rtmp://live.twitch.tv/app/live_166160210_ZHhBDWe1EEdfcgna30jo7srMmhWIiF');
define('TwitchUsername', 'mishuba');
define('TwitchOauthToken', 'oauth:your_oauth_token');
define('TwitchOauthLink', 'https://world.tsunamilow.club/Authorization/Twitch.php');

define('TwitchChannelName', 'mishuba');
define('TwitchExtensionName', 'TFnation');
define('TwitchAPIClientID', 'idos02y8nhgi419qnz9zsy5ns59zlf');

//https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=idos02y8nhgi419qnz9zsy5ns59zlf&redirect_uri=http://localhost&scope=chat:read+channel:read:subscriptions

//http://localhost/#access_token=your-oauth-token&scope=chat:read+channel:read:subscriptions

//Discord
//https://discord.com/developers/applications
define('DiscordBotToken', 'MTM2NTk4NzAyOTIyMTExMzg2Ng.G3KXlj.ahDVEQB-STVrhguZCrKLFfrv7TpVqs_xTvo0i0');
define('DiscordUserToken', '');
define('DiscordClientId', '1365987029221113866');
define('DiscordClientSecret', '4RLzJXJ2gS1299-JqauNNSP2nzc5M_v9');
define('DiscordApplicationId', '1365987029221113866');
define('DiscordPublicKey', '8d6bc842b78f59185e4a78dd705a9105e7de6df326cc11212eb2245ab57e13a9');
define('DiscordPermissionsInteger', '1759218604441591');
//https://world.tsunamilow.club/webhook/discord.php
define('DiscordInteractionEndpoint', '');
define('DiscordInstallLink', 'https://discord.com/oauth2/authorize?client_id=1365987029221113866
');
//Discord ends

//Youtube
define('YoutubeStreamKey', '3eqr-4vfq-56yj-amtg-e7v1');
define('YoutubeStreamURL', 'rtmp://a.rtmp.youtube.com/live2/');
define('YoutubeBackupServerUrl', 'rtmp://b.rtmp.youtube.com/live2?backup=1/');
define('YoutubeStreamLink', 'rtmp://a.rtmp.youtube.com/live2/3eqr-4vfq-56yj-amtg-e7v1/');
define('YoutubeStreamLink2', 'rtmp://b.rtmp.youtube.com/live2?backup=1/3eqr-4vfq-56yj-amtg-e7v1/');
define('YoutubeUserID', 'qTtVsIfhihGuznFiBMXnlA');
define('YoutubeChannelID', 'UCqTtVsIfhihGuznFiBMXnlA');
define('YoutubeChannelLink', 'https://www.youtube.com/channel/UCqTtVsIfhihGuznFiBMXnlA');
//Youtube Ends

//Printful
//Api
define("printfulApiKey", "zSIjA6xKkH23eiWLcyNatqrNYgsf3HSLt7xFFTBo");
define("PrintfulBaseUrl", "https://api.printful.com/");
define("PrintfulOrdersUrl", "https://api.printful.com/orders");
//Printful Ends

//DocuSign(Tsunami, Real Estate, Personal)
define('DoSiToken', '');

//Linkedin
define('ClientID', '860g45em1zrui1');
define('ClientSecret', 'WPL_AP1.EReYM15sw4D3Jx4s.2MoCXQ==');
define('AppRedirectUrlSetting', 'https://www.linkedin.com/developers/tools/oauth/redirect');
define('AccessToken', 'AQVuL-uZx4mxACFMVlPWJfF3OgsUnkKzRv7VRVxl9hrdVU-Wz2_4gG8bm7o1W-pZxQ0fpMdNPrln545xKbeySQbV2pbRDga9bdv-g-UYb5KFFUub_9n0IV3YoJ0u0iL5b5dYk38Yr816pHM782bKFl-6yS7wjYnrXs_jbUVYTvhxR3gED61iMs1kRaPCAGnN305xw89RjQeYo71UaggzokCT_nAIOMfBC7r-mc6krW_Ooouvfug7xHGRGlUjrSI0dZ3q8roul7jayZ5dgHZDEGa3KECky4ltkZ2b1zsYZ8g3xps7DssQAmv_kGc5YVmdhee1eXu2v4goHT2CQtx5jaSxhxvovw'); //OAuth Scope, w_member_social
//LinkedIn Ends

//X studio.x.com
define('XtwitterClientID', 'R3VkSnhwWWxnX2JsV0NkNnZ1VTY6MTpjaQ');
define('XtwitterClientSecret', 'OZEhixO6pZescsgHidagypx9snHFghwIxLU_wdeBwAZiicLXQ6');
define('XtwitterName', 'TsunamiFlow');
define('XtwitterAppId', '30642322');
define('XtwitterStreamKey', 'bxvcf2fpdkz2');
define('XtwitterStreamLink', 'rtmp://va.pscp.tv:80/x');
define('XtwitterVideoLink', 'https://x.com/i/broadcasts/1dRKZYRVegdxB');
//X Ends

//Pinterest
//https://developers.pinterest.com/
define('PinterestStreamKey', '');
define('PinterestStreamLink', '');
define('PinterestAccessToken', 'pina_AMAZGLQXACTYUBAAGAAOED57UPUHNFQBQBIQCVVX6KZKZORWKFKUQYOT4MJFDPTWNBI7N3JYXJCWCK76WRPDD6SBFNIAA5IA');
define('PinterestAppId', '1519251');
define('PinterestAppSecretKey', '1519251');
//Pinterest Ends

//Quickbooks

//Google

//Google Ends

//Instagram
define('InstagramStreamKey', '');
define('InstagramStreamLink', '');
//Instagram Ends

//facebook
define('facebookStreamKey', '');
define('facebookStreamLink', '');
//facebook ends

//TikTok https://developers.tiktok.com/
define('TikTokOrganizationName', 'Tsunami Flow');
define('TikTokOrganizationID', '7497772712744453126');
define('TikTokAppName', 'TsunamiFlowClub');
define('TikTokClientKey', 'awar37qnfrrajfwm');
define('TikTokClientSecret', 'MeaUSKO8ehQnzVWNtk87zzE6xluPvQM6');
define('TikTokStreamKey', '');
define('TikTokStreamLink', '');//TikTok https://developers.tiktok.com/
//TikTok Ends

//backBlaze (VideoGame Database)
define("tfBBkeyId", "f88fe9eb0b94");
define("tfBBkeyName", "Master Application Key");
define("tfBBradioId", "005f88fe9eb0b940000000001");
define("tfBBradioKeyname", "TsunamiFlowRadio"); // we gonna use it for something else tho.
define("tfBBradioAppKey", "K005/+Ls8q+LNYitKH1E9aVY15d+858");
//BackBlaze Ends

//Firebase (Excel,CSV)

//Firebase Ends

//Mega.io (Video)

//Mega.io Ends
//http://www.tsunamiflow.club/privacypolicy.php
//http://www.tsunamiflow.club/TermsOfService.php
//http://www.tsunamiflow.club/
//http://www.tsunamiflow.club/
//Tsunami Ends

/*
Audio Codec     AAC
Audio Sampling  44100
Audio Bitrate   128000
Audio Channels  2
Video Codec     H.264/AVC 
Video Bitrate   9000000
Video framerate 30
Video Keyframe Interval In Seconds  3
Video width     1920
Video Height    1080
*/



//PayPal
define('PayPalAppName', 'TfClub');
define('PayPalWebhookID', '53G04771MC2801233');
define("PaypalClientId", "Aamz4BjBhnl97TdPoADLjUgAKYOoZIabVD8plWBeL9uvRtVTYDb4_bLweEgKHFAcP95VwFWDgyI00uwo");
define("PaypalSecretKey", "ELyjSysRoGJlHBU-GzUpc6nuUV4nKILsM3VhkwVjwm27O9X_xo00o8KNsztvK1Ht7CGkG3P2u45rm7NA");
//Paypal Ends

//UiPath
define('OrganizationName', 'Tsunami Flow');
define('URL', 'https://cloud.uipath.com/tsunayfrklwm');
define('SupportID', '3078-9849-0990-3491');
define('ClientStudioID', '449614c0-c552-433c-88fb-575d38a0e93e');
define('ClientTechComputerID', 'a474e02e-9f64-4b3e-8300-f5329d70b545');
define('MachineStudioKey', '449614c0-c552-433c-88fb-575d38a0e93e');
define('MachineTechComputerKey', 'a474e02e-9f64-4b3e-8300-f5329d70b545');
define('MachineTechComputerName', "Tech Computer");
define('ClientStudioSercet', 'tILGdlqjZ7Zyo6gi');
define('ClientTechComputerSecret', 'qdrcpXxta0mJhzuO');
define('DocumentUnderstanding', 'afy9pbEUdSdFl5fBak5fE+sfZ88YA/6COMwFeb9xRKmkwLJjhuG8Rl716qOdYmvZwsNrdsbxAYwn9MDcXh0BnA=='); //Document Understanding Limit is 2 pages and 4 mb
define('ComputerVision', 'SNqUjAWbunYbD91QcDI5CERfiKZKQnuRLxZe4/vZLn0LHrNAcGpgD1ykoQcmbjMAMJ//8nclOkgEL6XWWAcCmg=='); // Computer Vision limited to 30 megapixels
define('Hostname', 'TFNATION');
define('Username', 'TFNATION\MISHU');
//HTTP WEBHOOK (UiPath)
//define('', '');
//UiPath Ends