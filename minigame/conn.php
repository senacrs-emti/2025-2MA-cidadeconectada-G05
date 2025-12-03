<?php
define('DBHOST', 'localhost');
define('DBUSER', 'root');
define('DBPASS', '');
define('DBBASE', 'mini_game');

try {
    $pdo = new PDO("mysql:host=" . DBHOST . ";dbname=" . DBBASE . ";charset=utf8", DBUSER, DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if (isset($_POST['nome']) && isset($_POST['score'])) {
        $nome = trim($_POST['nome']);
        $score = (int) $_POST['score'];

        if ($nome !== '') {
            $stmt = $pdo->prepare("INSERT INTO scores (nome, score) VALUES (:nome, :score)");
            $stmt->execute([':nome' => $nome, ':score' => $score]);

            header("Location: ranking.php");
            exit;
        } else {
            echo "Nome inválido.";
        }
    }

} catch (PDOException $e) {
    echo "Erro ao salvar o placar: " . $e->getMessage();
}
?>
