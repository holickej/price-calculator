<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

//require_once get_template_directory() . '/inc/PHPMaier/vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $jmeno_prijmeni = $_POST["jmeno_prijmeni"];
    $email = $_POST["email"];
    $zprava = $_POST["zprava"];
    $selectedMainChoice = $_POST["selectedMainChoice"];

    // Zpracování JSON dat z 'dataToForm'
    $dataToForm = json_decode($_POST['dataToForm'], true);
    $selectedOptions = json_decode($_POST['selectedOptions'], true);
    

    $selectedOptionsHtml = "";
    foreach ($dataToForm as $key => $value) {
        $optionPrice = isset($selectedOptions[$key]) ? $selectedOptions[$key] : 0;
        $selectedOptionsHtml .= "<b>$value:</b> $optionPrice Kč<br>";
    }

    $totalPrice = number_format(array_sum($selectedOptions), 0, ',', ' ');

    $mail = new PHPMailer(true);
    $mail->CharSet = "UTF-8";

    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host = '';
        $mail->SMTPAuth = true;
        $mail->Username = '';
        $mail->Password = '';
        $mail->SMTPSecure = '';
        $mail->Port = 587;

        // Nastavení odesílatele
        $mail->setFrom("josefjan@holicky.dev", "holicky.dev");

        // Nastavení příjemce
        $mail->addAddress("josefjan@holicky.dev");

        // Nastavení obsahu emailu
        $mail->isHTML(true);
        $mail->Subject = "Nová kalkulace z webu";
        $mail->Body    = "
        
        <b>Jméno a příjmení:</b> {$jmeno_prijmeni}<br>
        <b>Email:</b> {$email}<br>
        <br>
        <b>Zpráva:</b> {$zprava}<br>
        <br>
        <b>Vybraná oblast klientem:</b> {$selectedMainChoice}
        <br>
        <br>
        <b>Vybrané možnosti a ceny:</b><br>
        <br>
        {$selectedOptionsHtml}
        <br>
        <b>Celková cena:</b> {$totalPrice},- Kč.
        ";

        $mail->send();

        // Odeslání potvrzovacího emailu klientovi
        $mail->clearAddresses();
        $mail->addAddress($email);
        $mail->Subject = "Přijetí kalkulace od holicky.dev";
        $mail->Body    = "
        <h1>Dobrý den {$jmeno_prijmeni},<br></h1>
        Děkuji za Váš zájem o mé služby. Ozvu se Vám do 3 pracovních dní.<br><br>

        <h3>Rekapitulace:</h3>
        <p><b>Vybraná oblast:</b> {$selectedMainChoice}</p>
        <br>
        {$selectedOptionsHtml}
        <br>

        <br><br>S pozdravem, Josef Jan Holický.<br>
        <a href='https://holicky.dev'>holicky.dev</a>
        ";
        $mail->send();

        echo "Email byl úspěšně odeslán";
    } catch (Exception $e) {
        echo "Nepodařilo se odeslat email. Chyba: {$mail->ErrorInfo}";
    }
}
?>
