<?php
include 'conn.php';
try {
    $pdo = new PDO("mysql:host=" . DBHOST . ";dbname=" . DBBASE . ";charset=utf8", DBUSER, DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT nome, score, data_registro FROM scores ORDER BY score DESC, data_registro ASC");
    $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Erro ao conectar ao banco: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Ranking</title>
    <style>
        body {
            background: #111;
            color: #f8f8f8;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px;
        }
        h1 {
            margin-bottom: 20px;
            color: #00ffc3;
        }
        table {
            border-collapse: collapse;
            width: 80%;
            max-width: 600px;
            background: #1e1e1e;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 15px rgba(0,0,0,0.6);
        }
        th, td {
            padding: 12px 16px;
            text-align: center;
        }
        th {
            background: #00ffc3;
            color: #000;
        }
        tr:nth-child(even) {
            background-color: #2a2a2a;
        }
        tr:hover {
            background-color: #333;
        }
        .back {
            margin-top: 25px;
            color: #00ffc3;
            text-decoration: none;
            font-weight: bold;
        }
        .back:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>Ranking</h1>

    <table>
        <thead>
            <tr>
                <th>Posição</th>
                <th>Nome</th>
                <th>Score</th>
                <th>Data</th>
            </tr>
        </thead>
        <tbody>
            <?php if (count($scores) > 0): ?>
                <?php foreach ($scores as $i => $s): ?>
                    <tr>
                        <td><?= $i + 1 ?></td>
                        <td><?= htmlspecialchars($s['nome']) ?></td>
                        <td><?= $s['score'] ?></td>
                        <td><?= date('d/m/Y H:i', strtotime($s['data_registro'])) ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr><td colspan="4">Nenhum score registrado ainda </td></tr>
            <?php endif; ?>
        </tbody>
    </table>

    <a href="./minigame.html" class="back">⬅ Voltar ao jogo</a>
</body>
</html>
