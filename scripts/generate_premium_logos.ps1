Add-Type -AssemblyName System.Drawing

function Create-AppIcon {
    param([string]$outputPath, [int]$size = 1024)

    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # 1. Dark Gradient Background (#0A0E1A to #141D33)
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.ColorTranslator]::FromHtml("#0A0E1A"),
        [System.Drawing.ColorTranslator]::FromHtml("#141D33"),
        45.0
    )
    $g.FillRectangle($bgBrush, $rect)

    # 2. Cyan Center Glow / Flare
    $glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $glowPath.AddEllipse(($size * 0.2), ($size * 0.2), ($size * 0.6), ($size * 0.6))
    $pbr = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
    $pbr.CenterColor = [System.Drawing.Color]::FromArgb(70, 0, 212, 255)
    $pbr.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 10, 14, 26))
    $g.FillPath($pbr, $glowPath)

    # 3. Squircle Base for Icon
    $pad = $size * 0.16
    $sqSize = $size - (2 * $pad)
    $rad = $sqSize * 0.28
    
    $sqPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $sqPath.AddArc($pad, $pad, $rad, $rad, 180, 90)
    $sqPath.AddArc($pad + $sqSize - $rad, $pad, $rad, $rad, 270, 90)
    $sqPath.AddArc($pad + $sqSize - $rad, $pad + $sqSize - $rad, $rad, $rad, 0, 90)
    $sqPath.AddArc($pad, $pad + $sqSize - $rad, $rad, $rad, 90, 90)
    $sqPath.CloseFigure()

    # Fill Squircle with Glass Dark Blue
    $sqBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.Color]::FromArgb(230, 20, 29, 48),
        [System.Drawing.Color]::FromArgb(245, 12, 17, 30),
        90.0
    )
    $g.FillPath($sqBrush, $sqPath)

    # Border with glowing Ice-Blue
    $sqPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#00D4FF"), ($size * 0.018))
    $g.DrawPath($sqPen, $sqPath)

    # 4. Scanner Corners (Reticle)
    $retPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#7DD3FC"), ($size * 0.026))
    $retPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $retPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    
    $inPad = $pad + ($sqSize * 0.15)
    $inW = $sqSize * 0.70
    $arm = $inW * 0.22

    # Top-Left
    $g.DrawLine($retPen, $inPad, $inPad + $arm, $inPad, $inPad)
    $g.DrawLine($retPen, $inPad, $inPad, $inPad + $arm, $inPad)
    # Top-Right
    $g.DrawLine($retPen, $inPad + $inW - $arm, $inPad, $inPad + $inW, $inPad)
    $g.DrawLine($retPen, $inPad + $inW, $inPad, $inPad + $inW, $inPad + $arm)
    # Bottom-Left
    $g.DrawLine($retPen, $inPad, $inPad + $inW - $arm, $inPad, $inPad + $inW)
    $g.DrawLine($retPen, $inPad, $inPad + $inW, $inPad + $arm, $inPad + $inW)
    # Bottom-Right
    $g.DrawLine($retPen, $inPad + $inW - $arm, $inPad + $inW, $inPad + $inW, $inPad + $inW)
    $g.DrawLine($retPen, $inPad + $inW, $inPad + $inW - $arm, $inPad + $inW, $inPad + $inW)

    # 5. Connected Infinity/Link Nodes (Center)
    $cx = $size / 2.0
    $cy = $size / 2.0
    
    # Left Node (Pure White) & Right Node (Ice-Blue)
    $nodeR = $size * 0.075
    $linkDist = $size * 0.14
    $leftX = $cx - $linkDist
    $rightX = $cx + $linkDist

    # Bridge Beam
    $beamPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#00D4FF"), ($size * 0.035))
    $beamPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $beamPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawLine($beamPen, $leftX, $cy, $rightX, $cy)

    # Outer Link Rings
    $ringPenWhite = New-Object System.Drawing.Pen([System.Drawing.Color]::White, ($size * 0.042))
    $g.DrawEllipse($ringPenWhite, ($leftX - $nodeR), ($cy - $nodeR), ($nodeR * 2), ($nodeR * 2))

    $ringPenCyan = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#00D4FF"), ($size * 0.042))
    $g.DrawEllipse($ringPenCyan, ($rightX - $nodeR), ($cy - $nodeR), ($nodeR * 2), ($nodeR * 2))

    # Inner Glowing Dots
    $dotBrushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillEllipse($dotBrushWhite, ($leftX - ($nodeR * 0.35)), ($cy - ($nodeR * 0.35)), ($nodeR * 0.7), ($nodeR * 0.7))

    $dotBrushCyan = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#00D4FF"))
    $g.FillEllipse($dotBrushCyan, ($rightX - ($nodeR * 0.35)), ($cy - ($nodeR * 0.35)), ($nodeR * 0.7), ($nodeR * 0.7))

    # 6. Fine outer highlight border
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 0, 212, 255), ($size * 0.008))
    $g.DrawRectangle($borderPen, 2, 2, ($size - 4), ($size - 4))

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created App Icon at $outputPath"
}

function Create-HorizontalLogo {
    param([string]$outputPath, [bool]$transparent = $false)

    $width = 1600
    $height = 480
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    if (-not $transparent) {
        $rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
        $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            $rect,
            [System.Drawing.ColorTranslator]::FromHtml("#0A0E1A"),
            [System.Drawing.ColorTranslator]::FromHtml("#12192C"),
            0.0
        )
        $g.FillRectangle($bgBrush, $rect)
        $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(45, 0, 212, 255), 3)
        $g.DrawRectangle($borderPen, 2, 2, ($width - 4), ($height - 4))
    }

    # 1. Left Emblem (Size 300x300 at x=80, y=90)
    $emblemSize = 300
    $emblemX = 80
    $emblemY = 90

    # Glow under emblem
    $glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $glowPath.AddEllipse(($emblemX - 30), ($emblemY - 30), ($emblemSize + 60), ($emblemSize + 60))
    $pbr = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
    $pbr.CenterColor = [System.Drawing.Color]::FromArgb(80, 0, 212, 255)
    $pbr.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 10, 14, 26))
    $g.FillPath($pbr, $glowPath)

    # Squircle
    $rad = $emblemSize * 0.28
    $sqPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $sqPath.AddArc($emblemX, $emblemY, $rad, $rad, 180, 90)
    $sqPath.AddArc($emblemX + $emblemSize - $rad, $emblemY, $rad, $rad, 270, 90)
    $sqPath.AddArc($emblemX + $emblemSize - $rad, $emblemY + $emblemSize - $rad, $rad, $rad, 0, 90)
    $sqPath.AddArc($emblemX, $emblemY + $emblemSize - $rad, $rad, $rad, 90, 90)
    $sqPath.CloseFigure()

    $sqBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Rectangle($emblemX, $emblemY, $emblemSize, $emblemSize)),
        [System.Drawing.Color]::FromArgb(240, 20, 29, 48),
        [System.Drawing.Color]::FromArgb(250, 12, 17, 30),
        90.0
    )
    $g.FillPath($sqBrush, $sqPath)
    $sqPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#00D4FF"), 5)
    $g.DrawPath($sqPen, $sqPath)

    # Reticle corners
    $retPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#7DD3FC"), 8)
    $retPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $retPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $rPad = $emblemX + 45
    $rPadY = $emblemY + 45
    $rW = $emblemSize - 90
    $arm = 45

    $g.DrawLine($retPen, $rPad, $rPadY + $arm, $rPad, $rPadY)
    $g.DrawLine($retPen, $rPad, $rPadY, $rPad + $arm, $rPadY)
    $g.DrawLine($retPen, $rPad + $rW - $arm, $rPadY, $rPad + $rW, $rPadY)
    $g.DrawLine($retPen, $rPad + $rW, $rPadY, $rPad + $rW, $rPadY + $arm)
    $g.DrawLine($retPen, $rPad, $rPadY + $rW - $arm, $rPad, $rPadY + $rW)
    $g.DrawLine($retPen, $rPad, $rPadY + $rW, $rPad + $arm, $rPadY + $rW)
    $g.DrawLine($retPen, $rPad + $rW - $arm, $rPadY + $rW, $rPad + $rW, $rPadY + $rW)
    $g.DrawLine($retPen, $rPad + $rW, $rPadY + $rW - $arm, $rPad + $rW, $rPadY + $rW)

    # Link Nodes
    $ecx = $emblemX + ($emblemSize / 2.0)
    $ecy = $emblemY + ($emblemSize / 2.0)
    $enR = 24
    $eDist = 44

    $eBeam = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#00D4FF"), 11)
    $eBeam.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $eBeam.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawLine($eBeam, ($ecx - $eDist), $ecy, ($ecx + $eDist), $ecy)

    $g.DrawEllipse((New-Object System.Drawing.Pen([System.Drawing.Color]::White, 12)), ($ecx - $eDist - $enR), ($ecy - $enR), ($enR * 2), ($enR * 2))
    $g.DrawEllipse((New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#00D4FF"), 12)), ($ecx + $eDist - $enR), ($ecy - $enR), ($enR * 2), ($enR * 2))
    $g.FillEllipse((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), ($ecx - $eDist - 8), ($ecy - 8), 16, 16)
    $g.FillEllipse((New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#00D4FF"))), ($ecx + $eDist - 8), ($ecy - 8), 16, 16)

    # 2. Typography: "SmartExpoLink"
    # Choose font
    $fontFamily = "Segoe UI"
    $fontNames = [System.Drawing.FontFamily]::Families | ForEach-Object { $_.Name }
    if ($fontNames -contains "Syne") { $fontFamily = "Syne" }
    elseif ($fontNames -contains "Inter") { $fontFamily = "Inter" }
    elseif ($fontNames -contains "Arial") { $fontFamily = "Arial" }

    $fontTitle = New-Object System.Drawing.Font($fontFamily, 130, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fontSub = New-Object System.Drawing.Font($fontFamily, 28, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

    $brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $brushCyan = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#00D4FF"))
    $brushSub = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#7DD3FC"))

    $textX = 440
    $textY = 125

    # Measure exact parts to join without gap
    $sf = [System.Drawing.StringFormat]::GenericTypographic
    $sizeSmart = $g.MeasureString("Smart", $fontTitle, 1000, $sf)
    $sizeExpo = $g.MeasureString("Expo", $fontTitle, 1000, $sf)

    # Draw "Smart"
    $g.DrawString("Smart", $fontTitle, $brushWhite, $textX, $textY, $sf)
    # Draw "Expo"
    $g.DrawString("Expo", $fontTitle, $brushCyan, ($textX + $sizeSmart.Width - 6), $textY, $sf)
    # Draw "Link"
    $g.DrawString("Link", $fontTitle, $brushWhite, ($textX + $sizeSmart.Width + $sizeExpo.Width - 12), $textY, $sf)

    # Subtitle
    $subY = $textY + 160
    $g.DrawString("AI TRADE FAIR LEAD CAPTURE & SOURCING PLATFORM", $fontSub, $brushSub, ($textX + 4), $subY, $sf)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created Horizontal Logo at $outputPath"
}

# Output directories
$webDir = "c:\Drive\Google AI Studio\Visitenkarten\smartexpolink_web\public"
$appDir = "c:\Drive\Google AI Studio\Visitenkarten\smartconnect_pro\assets\images"
$brainDir = "C:\Users\rolan\.gemini\antigravity\brain\175f7769-0c68-4c58-aec6-501e3b788756"

# 1. 1024x1024 Master App Icon (for Stripe, Web & App)
Create-AppIcon -outputPath "$webDir\smartexpolink_app_icon.png" -size 1024
Create-AppIcon -outputPath "$appDir\smartexpolink_app_icon.png" -size 1024
Create-AppIcon -outputPath "$brainDir\smartexpolink_app_icon.png" -size 1024

# 2. Horizontal Logo Banner
Create-HorizontalLogo -outputPath "$webDir\smartexpolink_logo.png" -transparent $false
Create-HorizontalLogo -outputPath "$appDir\smartexpolink_logo.png" -transparent $false
Create-HorizontalLogo -outputPath "$brainDir\smartexpolink_logo.png" -transparent $false

# 3. Transparent Horizontal Logo (perfect for headers and receipts)
Create-HorizontalLogo -outputPath "$webDir\smartexpolink_logo_transparent.png" -transparent $true
Create-HorizontalLogo -outputPath "$appDir\smartexpolink_logo_transparent.png" -transparent $true
Create-HorizontalLogo -outputPath "$brainDir\smartexpolink_logo_transparent.png" -transparent $true
