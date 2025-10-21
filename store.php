<?php
session_start();
require '/stripestuff/vendor/autoload.php';
require 'config.php';

use Stripe\Stripe;
use Stripe\Checkout\Session;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// INIT STRIPE
Stripe::setApiKey(TfStripeSecretKey);

// CART INIT
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// GET PRODUCTS FROM PRINTFUL
function getPrintfulProducts() {
    $ch = curl_init('https://api.printful.com/store/products');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . printfulApiKey]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);
    $data = json_decode($result, true);
    return $data['result'] ?? [];
}

// ADD TO CART
// ADD TO CART
if (isset($_POST['add_to_cart'])) {
    $product_id = $_POST['product_id'];
    $variant_id = $_POST['variant_id'];
    $quantity = (int)$_POST['quantity'];

    // Fetch variant price from Printful
    $products = getPrintfulProducts();
    $variant_price = 0;
    foreach ($products as $product) {
        if ($product['id'] == $product_id) {
            foreach ($product['sync_variants'] as $variant) {
                if ($variant['id'] == $variant_id) {
                    $variant_price = floatval($variant['retail_price']); // in dollars
                    break 2;
                }
            }
        }
    }

    $_SESSION['cart'][] = [
        'product_id' => $product_id,
        'variant_id' => $variant_id,
        'quantity' => $quantity,
        'price' => $variant_price
    ];
    header('Location: ' . $_SERVER['PHP_SELF']);
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
                <?php foreach ($product['sync_variants'] as $variant): ?>
                    <option value="<?= $variant['id'] ?>"><?= htmlspecialchars($variant['name']) ?> - $<?= $variant['retail_price'] ?></option>
                <?php endforeach; ?>
            </select>
            <input type="number" name="quantity" value="1" min="1">
            <button name="add_to_cart">Add to Cart</button>
        </form>
    </li>
<?php endforeach; ?>
</ul>

<h2>Cart</h2>
<?php if (!empty($_SESSION['cart'])): ?>
    <table border="1" cellpadding="5">
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
            <th>Action</th>
        </tr>
        <?php
        $total = 0;
        foreach ($_SESSION['cart'] as $index => $item):
            $subtotal = $item['price'] * $item['quantity'];
            $total += $subtotal;
        ?>
        <tr>
            <td><?= htmlspecialchars($item['product_id']) ?></td>
            <td><?= $item['quantity'] ?></td>
            <td>$<?= number_format($item['price'], 2) ?></td>
            <td>$<?= number_format($subtotal, 2) ?></td>
            <td>
                <form method="POST">
                    <input type="hidden" name="remove_index" value="<?= $index ?>">
                    <button name="remove_from_cart">Remove</button>
                </form>
            </td>
        </tr>
        <?php endforeach; ?>
        <tr>
            <td colspan="3"><strong>Total</strong></td>
            <td colspan="2"><strong>$<?= number_format($total, 2) ?></strong></td>
        </tr>
    </table>
<?php else: ?>
    <p>Cart is empty</p>
<?php endif; ?>

<?php
// REMOVE FROM CART
if (isset($_POST['remove_from_cart'])) {
    $index = (int)$_POST['remove_index'];
    if (isset($_SESSION['cart'][$index])) {
        array_splice($_SESSION['cart'], $index, 1);
    }
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}
?>
<h2>Checkout</h2>
<form action="create_checkout.php" method="POST">
    <input name="name" placeholder="Full Name" required>
    <input name="email" placeholder="Email" required>
    <input name="address1" placeholder="Address" required>
    <input name="city" placeholder="City" required>
    <input name="state" placeholder="State" required>
    <input name="country" placeholder="Country" required>
    <input name="zip" placeholder="ZIP" required>
    <button>Checkout</button>
</form>
</body>
</html>