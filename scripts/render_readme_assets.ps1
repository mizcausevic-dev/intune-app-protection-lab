$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null

Add-Type -AssemblyName System.Drawing

function New-ProofImage {
    param(
        [string]$Path,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Bullets
    )

    $bitmap = New-Object System.Drawing.Bitmap 1600, 1000
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(7, 10, 15))

    $panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 18, 32))
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 255, 139))
    $altAccentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 199, 255))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(233, 243, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(171, 186, 201))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(42, 111, 88), 2)

    $graphics.FillRectangle($panelBrush, 48, 48, 1504, 904)
    $graphics.DrawRectangle($borderPen, 48, 48, 1504, 904)

    $eyebrowFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $titleFont = New-Object System.Drawing.Font("Georgia", 34, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 18)
    $bulletFont = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)

    $graphics.DrawString("Intune App Protection Lab", $eyebrowFont, $accentBrush, 92, 92)
    $graphics.DrawString($Title, $titleFont, $textBrush, 92, 142)
    $graphics.DrawString($Subtitle, $bodyFont, $mutedBrush, 92, 214)

    $y = 320
    foreach ($bullet in $Bullets) {
        $graphics.DrawString("•", $bulletFont, $altAccentBrush, 108, $y)
        $graphics.DrawString($bullet, $bodyFont, $textBrush, 138, $y + 2)
        $y += 82
    }

    $graphics.DrawString("Synthetic proof render for README packaging.", $bodyFont, $mutedBrush, 92, 880)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofImage -Path (Join-Path $screenshots "01-overview-proof.png") `
    -Title "Overview proof" `
    -Subtitle "App protection posture, unmanaged transfer risk, BYOD scope, and enforcement sequencing in one Intune operator surface." `
    -Bullets @(
        "Missing protection assignments stay visible before rollout windows widen.",
        "Legacy exception lanes show copy/paste, browser, and jailbreak risk together.",
        "Every lane stays tied to an operator-safe enforcement packet."
    )

New-ProofImage -Path (Join-Path $screenshots "02-protection-lane-proof.png") `
    -Title "Protection lane" `
    -Subtitle "Each app lane keeps owner, persona, platform, protection state, and next action visible." `
    -Bullets @(
        "BYOD, contractor, frontline, and finance lanes stay separated cleanly.",
        "Protection state remains readable at a glance.",
        "Next actions stay operator-safe and audit-readable."
    )

New-ProofImage -Path (Join-Path $screenshots "03-policy-gaps-proof.png") `
    -Title "Policy gaps" `
    -Subtitle "Findings map severity, owner, app, platform, and the exact protection rule that fired." `
    -Bullets @(
        "High-severity app-protection findings surface first.",
        "Operators can tie risk back to business lane and platform quickly.",
        "The lane is grounded in real Intune app-protection primitives."
    )

New-ProofImage -Path (Join-Path $screenshots "04-enforcement-posture-proof.png") `
    -Title "Enforcement posture" `
    -Subtitle "Packets tie completeness, blocker, owner, and rollout timing together." `
    -Bullets @(
        "BYOD, contractor, frontline, and finance packets stay visible.",
        "Red/yellow/green posture remains easy to scan.",
        "The system is shaped for real MAM and app-protection operations proof."
    )
