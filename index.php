<?php
     /* ini_set('display_errors', 1);
    error_reporting(E_ALL); */
?>

<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HOLICKY DEVELOPER</title>
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <link rel="stylesheet" href="assets/css/price.css">
        <link rel="stylesheet" href="assets/css/price-calculator.css">
        
    </head>
    <body>

        <?php include 'parts/price-calculator.php';?>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
        <script src="assets/js/price.js"></script>
        <script src="assets/js/price-calculator.js"></script>
    </body>
</html>