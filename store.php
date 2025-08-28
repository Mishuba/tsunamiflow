<?php
session_start();
require '/stripestuff/vendor/autoload.php'; // Assuming Stripe PHP library installed via composer
require 'config.php';
use Stripe\Stripe;
use Stripe\PaymentIntent;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// CONFIG
define('FROM_EMAIL', 'your@email.com');

// INIT STRIPE
Stripe::setApiKey(TfStripeSecretKey);

// GET PRODUCTS
function getPrintfulProducts() {
    $ch = curl_init('https://api.printful.com/store/products');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . printfulApiKey]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);
    $data = json_decode($result, true);
    return $data['result'] ?? [];
}

// CREATE PRINTFUL ORDER
function createPrintfulOrder($order) {
    $ch = curl_init('https://api.printful.com/orders');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . printfulApiKey,
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($order));
    $result = curl_exec($ch);
    curl_close($ch);
    return json_decode($result, true);
}

// SEND RECEIPT
function sendReceipt($to, $orderDetails) {
    $mail = new PHPMailer(true);
    try {
        $mail->setFrom(TfEmailFr, 'Tsunami Flow Store');
        $mail->addAddress($to);
        $mail->Subject = 'Your Tsunami Flow Store Receipt';
        $mail->Body = "Thank you for your order! Here are your details:\n\n" . print_r($orderDetails, true);
        $mail->send();
    } catch (Exception $e) {}
}

// ADD TO CART
if (isset($_POST['add_to_cart'])) {
    $product_id = $_POST['product_id'];
    $variant_id = $_POST['variant_id'];
    $quantity = $_POST['quantity'];
    $_SESSION['cart'][] = compact('product_id', 'variant_id', 'quantity');
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

// CHECKOUT
if (isset($_POST['checkout'])) {
    $customer_email = $_POST['email'];
    $total_amount = 0;
    $items = [];
    foreach ($_SESSION['cart'] as $item) {
        $items[] = [
            'variant_id' => $item['variant_id'],
            'quantity' => $item['quantity']
        ];
        // Dummy price, ideally fetch from product API
        $total_amount += 2000 * $item['quantity']; // $20 each
    }
    $payment_intent = PaymentIntent::create([
        'amount' => $total_amount,
        'currency' => 'usd',
        'receipt_email' => $customer_email,
        'automatic_payment_methods' => ['enabled' => true]
    ]);
    $order = [
        'recipient' => [
            'name' => $_POST['name'],
            'address1' => $_POST['address1'],
            'city' => $_POST['city'],
            'state_code' => $_POST['state'],
            'country_code' => $_POST['country'],
            'zip' => $_POST['zip'],
            'email' => $customer_email
        ],
        'items' => $items
    ];
    $order_response = createPrintfulOrder($order);
    sendReceipt($customer_email, $order_response);
    $_SESSION['cart'] = [];
    echo "<h2>Order completed! Check your email for receipt.</h2>";
    exit;
}

// SHOW STORE
$products = getPrintfulProducts();
?>
<!DOCTYPE html>
<html>
<body>
<h1>Tsunami Flow Store</h1>
<h2>Products</h2>
<ul>
<?php foreach ($products as $product): ?>
    <li>
        <?php echo htmlspecialchars($product['name']); ?>
        <form method="POST">
            <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
            <select name="variant_id">
                <?php
                foreach ($product['sync_variants'] as $variant) {
                    echo "<option value=\"{$variant['id']}\">{$variant['name']} - \${$variant['retail_price']}</option>";
                }
                ?>
            </select>
            <input type="number" name="quantity" value="1" min="1">
            <button name="add_to_cart">Add to Cart</button>
        </form>
    </li>
<?php endforeach; ?>
</ul>

<h2>Cart</h2>
<ul>
<?php if (!empty($_SESSION['cart'])): ?>
    <?php foreach ($_SESSION['cart'] as $item): ?>
        <li>Product ID: <?php echo $item['product_id']; ?> Quantity: <?php echo $item['quantity']; ?></li>
    <?php endforeach; ?>
<?php else: ?>
    <li>Cart is empty</li>
<?php endif; ?>
</ul>

<h2>Checkout</h2>
<form method="POST">
    <input name="name" placeholder="Full Name" required>
    <input name="email" placeholder="Email" required>
    <input name="address1" placeholder="Address" required>
    <input name="city" placeholder="City" required>
    <input name="state" placeholder="State" required>
    <input name="country" placeholder="Country" required>
    <input name="zip" placeholder="ZIP" required>
    <button name="checkout">Checkout</button>
</form>
</body>
</html>
