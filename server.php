<?php
error_reporting(E_ALL);
ini_set('display_errors',1);
ini_set("session.cookie_secure",true);
ini_set("session.cookie_httponly",true);
ini_set("session.gc_maxlifetime",3600);
ini_set("session.cookie_lifetime",0);
ini_set("session.use_strict_mode",true);

session_start();

function respond(array $data,int $code=200){http_response_code($code);header('Content-Type: application/json; charset=utf-8');exit(json_encode($data,JSON_UNESCAPED_SLASHES|JSON_INVALID_UTF8_IGNORE));}

$allowed=["https://www.tsunamiflow.club","https://world.tsunamiflow.club","https://tsunamiflow.club"];
if(isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'],$allowed)){header("Access-Control-Allow-Origin:".$_SERVER['HTTP_ORIGIN']);header("Access-Control-Allow-Methods:GET,POST,OPTIONS");header("Access-Control-Allow-Headers:Origin,Content-Type,Accept,Authorization,X-Requested-With");}
if($_SERVER['REQUEST_METHOD']==='OPTIONS') exit(http_response_code(200));

require_once "functions.php";
use Aws\S3\S3Client,Aws\Credentials\Credentials,Aws\Exception\AwsException,Stripe\StripeClient;

$bucket=getenv('CloudflareR2Name')?:'tsunami-radio';
if(!($ak=getenv('CloudflareR2AccessKey'))||!($sk=getenv('CloudflareR2SecretKey'))||!($ep=getenv('CloudflareR2Endpoint')))respond(["error"=>"Missing R2 credentials"],500);
try{$s3=new S3Client(["region"=>"auto","endpoint"=>$ep,"version"=>"latest","credentials"=>new Credentials($ak,$sk),"use_path_style_endpoint"=>false]);}catch(Exception$e){respond(["error"=>$e->getMessage()],500);}

$_SESSION["visit_count"]=($_SESSION["visit_count"]??0)+1;
$_SESSION["UserPreferences"]=$_SESSION["UserPreferences"]??["Chosen_Companion"=>"Ackma Hawk"];
$_SESSION["Setting"]=$_SESSION["Setting"]??["font_style"=>"auto"];

foreach(["TfGuestCount","freeMembershipCount","lowestMembershipCount","middleMembershipCount","highestMembershipCount","TfMemberCount"] as $c) $_SESSION[$c]=$_SESSION[$c]??0;
if(!($_SESSION["TfNifage"]??false)) $_SESSION["TfGuestCount"]++; else{switch($_SESSION["TfAccess"]??"free"){case"Regular":$_SESSION["lowestMembershipCount"]++;break;case"Vip":$_SESSION["middleMembershipCount"]++;break;case"Team":$_SESSION["highestMembershipCount"]++;break;default:$_SESSION["freeMembershipCount"]++;}$_SESSION["TfMemberCount"]++;}

setcookie("TfAccess",$_SESSION["TfAccess"]??"guest",time()+86400*30,"/","",true,true);
setcookie("visit_count",$_SESSION["visit_count"],time()+86400,"/","",true,true);

$data=json_decode(file_get_contents("php://input"),true)??[];

if($_SERVER["REQUEST_METHOD"]==="POST" && ($_SERVER["HTTP_X_REQUEST_TYPE"]??'')==="fetchRadioSongs"){
    $sent=array_map(fn()=>[],range(0,23));
    foreach([0=>4,1=>4,3=>3,4=>3,5=>3,6=>3,7=>3,8=>6,9=>3,12=>4,13=>4,14=>4,15=>4,16=>4,18=>6,19=>4,20=>4] as $i=>$c)$sent[$i]=array_map(fn()=>[],range(0,$c-1));
    $mapping=[0=>['IceBreakers','Flirting','GetHerDone','Shots'],1=>['Twerking','LineDance','PopDance','Battle'],2=>[null],3=>['Foreplay','sex','Cuddle'],4=>['Memories','love','Intimacy'],5=>['Lifestyle','Values','Kids'],6=>['Motivation','Meditation','Something'],7=>['DH','BAH','HFnineteen'],8=>['Neutral','Democracy','Republican','Socialism','Bureaucracy','Aristocratic'],9=>['Fighters','Shooters','Instrumentals'],10=>[null],12=>['Poems','SS','Instrumentals','Books'],13=>['Reviews','Fans','Updates','Disses'],14=>['News','Music','History','Instrumentals'],15=>['Biology','Chemistry','Physics','Environmental'],16=>['EP','Seller','Mortgage','Buyer'],17=>[null],18=>['NM','SHM','MH','VM','LS','CB'],19=>['PD','LD','FH','SM'],20=>['FE','TOB','Insurance','TE'],21=>[null],22=>[null],23=>[null]];
    $folders=[0=>'Rizz',1=>'Dance',2=>'Afterparty',3=>'Sex',4=>'Love',5=>'Family',6=>'Inspiration',7=>'History',8=>'Politics',9=>'Gaming',10=>'Comedy',12=>'Literature',13=>'Sports',14=>'Tech',15=>'Science',16=>'RealEstate',17=>'DJshuba',18=>'Film',19=>'Fashion',20=>'Business',21=>'Hustlin',22=>'Pregame',23=>'Outside'];
    $add=function(array &$a,string $p,int $i,$j=null)use($s3,$bucket){try{$pg=$s3->getPaginator('ListObjectsV2',['Bucket'=>$bucket,'Prefix'=>rtrim(ltrim($p,'/'),'/').'/']);foreach($pg as $page)foreach($page['Contents']??[] as $o){if(!isset($o['Key'])||!str_ends_with(strtolower($o['Key']),'.mp3'))continue;$u=trim(urldecode(ltrim($o['Key'],'/')));if($j!==null)$a[$i][$j][]=$u;else$a[$i][]=$u;$a[11][]=$u;}}catch(AwsException$e){error_log($e->getMessage());}};
    foreach($mapping as $ci=>$subs)foreach($subs as $si=>$f){$cat=$folders[$ci]??'';$path=$f?"Music/$cat/$f/":"Music/$cat/";$add($sent,$path,$ci,$f!==null?$si:null);}
    respond($sent);
}

$stripe=new StripeClient(getenv("StripeSecretKey"));
$domain="https://www.tsunamiflow.club";
$Token="TsunamiFlowClubStripeToken";

try{
    $method=$_SERVER['REQUEST_METHOD'];
    if($method==='POST'){
        if(stripos($_SERVER['CONTENT_TYPE']??'','application/json')!==false)$data=json_decode(file_get_contents('php://input'),true)??[];

        if(($_POST['token']??'')===$Token){$sid=$_POST['session_id']??null;if(!$sid)respond(['error'=>'Missing session_id'],400);$s=\Stripe\Checkout\Session::retrieve($sid);$m=$s->metadata??[];if(!empty($m['TFRegisterPassword']))$m['TFRegisterPassword']=password_hash($m['TFRegisterPassword'],PASSWORD_DEFAULT);InputIntoDatabase(...array_values($m));header("Location: $domain");exit;}

        if(($data['type']??'')==='Subscribers Signup'){$m=$_POST['membershipLevel']??'free';$u=$_POST;if(!empty($u['TFRegisterPassword']))$u['TFRegisterPassword']=password_hash($u['TFRegisterPassword'],PASSWORD_DEFAULT);if($m==='free'){InputIntoDatabase($m,...array_values($u));respond(['success'=>true,'message'=>'Free membership created']);}$costMap=['regular'=>400,'vip'=>700,'team'=>1000];$s=\Stripe\Checkout\Session::create(['payment_method_types'=>['card'],'mode'=>'payment','line_items'=>[['price_data'=>['currency'=>'usd','unit_amount'=>$costMap[strtolower($m)]??2000,'product_data'=>['name'=>'Community Member Signup Fee']],'quantity'=>1]],'success_url'=>"$domain/server.php?session_id={CHECKOUT_SESSION_ID}",'cancel_url'=>"$domain/failed.php",'metadata'=>$u]);header("Location: ".$s->url);exit;}

        if(($data['type']??'')==='Navigation Login'){$_SESSION['LoginStatus']=!empty($data['log in']);respond(['success'=>true,'message'=>$_SESSION['LoginStatus']?'Logged in':'Logged out']);}
        if(($data['type']??'')==='Tsunami Flow Store')respond(['success'=>true,'message'=>'Store endpoint hit']);
        respond(['error'=>'Invalid POST type'],400);
    }

    if($method==='GET'){
        if(isset($_GET['shopping_cart'])){$_SESSION['ShoppingCartItems']=$_GET['shopping_cart'];respond(['success'=>true,'items'=>$_SESSION['ShoppingCartItems']]);}
        respond(['success'=>true,'message'=>'GET request received']);
    }

    respond(['error'=>'Invalid request method'],400);
}catch(Exception$e){respond(['error'=>$e->getMessage()],500);}

myProductsFr = BasicPrintfulRequest();

if(!($myProductsFr=false)) echo "No data received from Printful API.";
?>