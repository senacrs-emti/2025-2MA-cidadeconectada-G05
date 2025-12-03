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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

body {
    background: #0a0a0a;
    color: #e8e8e8;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    min-height: 100vh;
}

h1 {
    margin-bottom: 28px;
    color: #00ffc3;
    font-size: 2rem;
    text-align: center;
    text-shadow: 0 0 8px #00ffc3aa;
}
.table-wrapper {
    width: 100%;
    max-width: 700px;
    overflow-x: auto;
    padding-bottom: 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
    background: #131313;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 0 18px rgba(0, 255, 200, 0.10);
    backdrop-filter: blur(6px);
}

th, td {
    padding: 14px 18px;
    text-align: center;
    font-size: 0.95rem;
}

th {
    background: #00ffc3;
    color: #000;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

tr:nth-child(even) {
    background: #1a1a1a;
}

tr:hover {
    background: #222;
    transition: background 0.2s ease;
}

.back {
    margin-top: 25px;
    color: #00ffc3;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    transition: 0.2s;
}

.back:hover {
    text-shadow: 0 0 8px #00ffc3;
    transform: scale(1.03);
}

@media (max-width: 480px) {
    body {
        padding: 20px 10px;
    }

    h1 {
        font-size: 1.6rem;
    }

    th, td {
        padding: 10px 12px;
        font-size: 0.85rem;
    }

    table {
        border-radius: 10px;
    }
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
