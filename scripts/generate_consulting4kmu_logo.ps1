# UTF-8 Encoding erzwingen
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Add-Type -AssemblyName System.Drawing

function Render-Logo {
    param(
        [string]$outputPath,
        [bool]$darkTheme = $false,
        [int]$width = 1800,
        [int]$height = 720
    )

    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Colors
    if ($darkTheme) {
        $bgColor = [System.Drawing.ColorTranslator]::FromHtml("#0A0E1A")
        $textColorMain = [System.Drawing.ColorTranslator]::FromHtml("#F8FAFC")
        $textColorSub = [System.Drawing.ColorTranslator]::FromHtml("#38BDF8")
        $lineColor = [System.Drawing.ColorTranslator]::FromHtml("#1E293B")
        $kwColor = [System.Drawing.ColorTranslator]::FromHtml("#94A3B8")
        $bar1 = [System.Drawing.ColorTranslator]::FromHtml("#475569")
        $bar2 = [System.Drawing.ColorTranslator]::FromHtml("#64748B")
        $bar3 = [System.Drawing.ColorTranslator]::FromHtml("#94A3B8")
    } else {
        $bgColor = [System.Drawing.Color]::White
        $textColorMain = [System.Drawing.ColorTranslator]::FromHtml("#1E293B")
        $textColorSub = [System.Drawing.ColorTranslator]::FromHtml("#0F172A")
        $lineColor = [System.Drawing.ColorTranslator]::FromHtml("#334155")
        $kwColor = [System.Drawing.ColorTranslator]::FromHtml("#64748B")
        $bar1 = [System.Drawing.ColorTranslator]::FromHtml("#CBD5E1")
        $bar2 = [System.Drawing.ColorTranslator]::FromHtml("#94A3B8")
        $bar3 = [System.Drawing.ColorTranslator]::FromHtml("#64748B")
    }

    $blueColor = [System.Drawing.ColorTranslator]::FromHtml("#0284C7")
    $cyanLight = [System.Drawing.ColorTranslator]::FromHtml("#38BDF8")
    $greenColor = [System.Drawing.ColorTranslator]::FromHtml("#84CC16")

    # Background
    $g.Clear($bgColor)

    # Scale factor
    $scale = $width / 1200.0

    # 1. EMBLEM "C" (Etwas kompakter & harmonisch skaliert, damit es perfekt mit der vergrößerten Wortmarke verschmilzt)
    $cx = 160 * $scale
    $cy = 175 * $scale
    $radiusOuter = 118 * $scale
    $radiusInner = 94 * $scale

    # Outer Blue Arc
    $penBlue = New-Object System.Drawing.Pen($blueColor, (22 * $scale))
    $penBlue.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penBlue.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawArc($penBlue, ($cx - $radiusOuter), ($cy - $radiusOuter), ($radiusOuter * 2), ($radiusOuter * 2), 35, 290)

    # Inner Green Arc
    $penGreen = New-Object System.Drawing.Pen($greenColor, (12 * $scale))
    $penGreen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penGreen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawArc($penGreen, ($cx - $radiusInner), ($cy - $radiusInner), ($radiusInner * 2), ($radiusInner * 2), 45, 270)

    # Data Analytics / AI Growth Bars inside "C"
    $bWidth = 19 * $scale
    $bGap = 7 * $scale
    $startX = $cx - (44 * $scale)
    $baseY = $cy + (44 * $scale)

    # Bar 1
    $h1 = 48 * $scale
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($bar1)), $startX, ($baseY - $h1), $bWidth, $h1)

    # Bar 2
    $h2 = 70 * $scale
    $x2 = $startX + $bWidth + $bGap
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($bar2)), $x2, ($baseY - $h2), $bWidth, $h2)

    # Bar 3
    $h3 = 94 * $scale
    $x3 = $x2 + $bWidth + $bGap
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($bar3)), $x3, ($baseY - $h3), $bWidth, $h3)

    # Neural Network / AI connection dots & lines
    $dotPen = New-Object System.Drawing.Pen($cyanLight, (3.5 * $scale))
    $dotPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $p1 = New-Object System.Drawing.PointF(($startX + $bWidth/2), ($baseY - $h1))
    $p2 = New-Object System.Drawing.PointF(($x2 + $bWidth/2), ($baseY - $h2))
    $p3 = New-Object System.Drawing.PointF(($x3 + $bWidth/2), ($baseY - $h3))
    $g.DrawLine($dotPen, $p1, $p2)
    $g.DrawLine($dotPen, $p2, $p3)

    $dotBrush = New-Object System.Drawing.SolidBrush($cyanLight)
    $dotR = 5 * $scale
    $g.FillEllipse($dotBrush, ($p1.X - $dotR), ($p1.Y - $dotR), ($dotR * 2), ($dotR * 2))
    $g.FillEllipse($dotBrush, ($p2.X - $dotR), ($p2.Y - $dotR), ($dotR * 2), ($dotR * 2))
    $g.FillEllipse($dotBrush, ($p3.X - $dotR), ($p3.Y - $dotR), ($dotR * 2), ($dotR * 2))

    # Dynamic AI Growth Arrow (Electric Blue / Background Border)
    $arrPenWhite = New-Object System.Drawing.Pen($bgColor, (14 * $scale))
    $arrPenWhite.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $arrPenWhite.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $arrPenWhite.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    $arrPenBlue = New-Object System.Drawing.Pen($blueColor, (9.5 * $scale))
    $arrPenBlue.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $arrPenBlue.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $arrPenBlue.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    $pts = @(
        (New-Object System.Drawing.PointF(($startX - 12 * $scale), ($baseY + 8 * $scale))),
        (New-Object System.Drawing.PointF(($startX + 19 * $scale), ($baseY - 22 * $scale))),
        (New-Object System.Drawing.PointF(($x2 + 18 * $scale), ($baseY - 8 * $scale))),
        (New-Object System.Drawing.PointF(($cx + 74 * $scale), ($cy - 82 * $scale)))
    )

    $g.DrawLines($arrPenWhite, $pts)
    $g.DrawLines($arrPenBlue, $pts)

    # Arrow Head
    $tip = New-Object System.Drawing.PointF(($cx + 84 * $scale), ($cy - 92 * $scale))
    $arrowPoly = @(
        $tip,
        (New-Object System.Drawing.PointF(($tip.X - 33 * $scale), ($tip.Y + 5 * $scale))),
        (New-Object System.Drawing.PointF(($tip.X - 16 * $scale), ($tip.Y + 24 * $scale)))
    )
    $g.FillPolygon((New-Object System.Drawing.SolidBrush($blueColor)), $arrowPoly)

    # 2. TYPOGRAPHY: "onsulting4KMU" (Viel näher an das "C", Schrift deutlich vergrößert für nahtloses "Consulting4KMU")
    $fontFamily = "Segoe UI"
    $fontNames = [System.Drawing.FontFamily]::Families | ForEach-Object { $_.Name }
    if ($fontNames -contains "Inter") { $fontFamily = "Inter" }

    # Schriftgröße deutlich erhöht: 104px (vorher 86px)
    $fontTitle = New-Object System.Drawing.Font($fontFamily, (104 * $scale), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $font4 = New-Object System.Drawing.Font($fontFamily, (104 * $scale), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fontClaim = New-Object System.Drawing.Font($fontFamily, (35 * $scale), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fontKw = New-Object System.Drawing.Font($fontFamily, (22 * $scale), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

    $brushText = New-Object System.Drawing.SolidBrush($textColorMain)
    $brushBlue = New-Object System.Drawing.SolidBrush($blueColor)
    $brushClaim = New-Object System.Drawing.SolidBrush($textColorSub)
    $brushKw = New-Object System.Drawing.SolidBrush($kwColor)

    # Deutlich näher an das C herangerückt: 275px (vorher 345px)
    $textStartX = 278 * $scale
    $textStartY = 100 * $scale
    $sf = [System.Drawing.StringFormat]::GenericTypographic

    $sizeOns = $g.MeasureString("onsulting", $fontTitle, 2000, $sf)
    $size4 = $g.MeasureString("4", $font4, 2000, $sf)

    # "onsulting"
    $g.DrawString("onsulting", $fontTitle, $brushText, $textStartX, $textStartY, $sf)
    # "4" in Electric Blue
    $g.DrawString("4", $font4, $brushBlue, ($textStartX + $sizeOns.Width - (4 * $scale)), $textStartY, $sf)
    # "KMU" in Bold
    $g.DrawString("KMU", $fontTitle, $brushText, ($textStartX + $sizeOns.Width + $size4.Width - (8 * $scale)), $textStartY, $sf)

    # 3. DIVIDING LINE (Zentriert)
    $lineY = 325 * $scale
    $lineMargin = 80 * $scale
    $g.DrawLine((New-Object System.Drawing.Pen($lineColor, (3 * $scale))), $lineMargin, $lineY, ($width - $lineMargin), $lineY)

    # 4. PRIMARY CLAIM: "KI-AGENTUR FÜR DEN MITTELSTAND" (EXAKT ZENTRIERT)
    $ueChar = [char]0x00DC
    $claimText = "KI-AGENTUR F" + $ueChar + "R DEN MITTELSTAND"
    $sizeClaim = $g.MeasureString($claimText, $fontClaim, 2000, $sf)
    $claimX = ($width - $sizeClaim.Width) / 2.0
    $claimY = 370 * $scale
    $g.DrawString($claimText, $fontClaim, $brushClaim, $claimX, $claimY, $sf)

    # 5. KEYWORDS: "PROZESSOPTIMIERUNG MITTELS KI  |  KI-BERATUNG & IMPLEMENTIERUNG" (EXAKT ZENTRIERT)
    $bullet = "   |   "
    $kwText = "PROZESSOPTIMIERUNG MITTELS KI" + $bullet + "KI-BERATUNG & IMPLEMENTIERUNG"
    $sizeKw = $g.MeasureString($kwText, $fontKw, 2000, $sf)
    $kwX = ($width - $sizeKw.Width) / 2.0
    $kwY = 440 * $scale
    $g.DrawString($kwText, $fontKw, $brushKw, $kwX, $kwY, $sf)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created Logo at: $outputPath"
}

$brainDir = "C:\Users\rolan\.gemini\antigravity\brain\175f7769-0c68-4c58-aec6-501e3b788756"
$webDir = "c:\Drive\Google AI Studio\Visitenkarten\smartexpolink_web\public"

# Render Light Version
Render-Logo -outputPath "$brainDir\consulting4kmu_ki_logo_light.png" -darkTheme $false
Render-Logo -outputPath "$webDir\consulting4kmu_ki_logo_light.png" -darkTheme $false

# Render Dark Mode Version
Render-Logo -outputPath "$brainDir\consulting4kmu_ki_logo_dark.png" -darkTheme $true
Render-Logo -outputPath "$webDir\consulting4kmu_ki_logo_dark.png" -darkTheme $true
