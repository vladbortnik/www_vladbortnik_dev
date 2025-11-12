<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:atom="http://www.w3.org/2005/Atom">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title><xsl:value-of select="rss/channel/title"/> - RSS Feed</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', 'Monaco', monospace;
            background: #000000;
            background-image:
                repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(24, 210, 110, 0.03) 1px, rgba(24, 210, 110, 0.03) 2px),
                repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(24, 210, 110, 0.03) 1px, rgba(24, 210, 110, 0.03) 2px);
            background-size: 20px 20px;
            color: #00ff41;
            line-height: 1.6;
            padding: 50px 20px 20px;
            min-height: 100vh;
            position: relative;
        }

        /* Terminal scanline effect */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
            z-index: 1000;
            opacity: 0.1;
        }

        /* Terminal cursor blink */
        @keyframes blink {
            0%, 49% { opacity: 1; }
            50%, 100% { opacity: 0; }
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(0, 20, 10, 0.7);
            border: 2px solid #00ff41;
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.3),
                        inset 0 0 50px rgba(0, 255, 65, 0.05);
            padding: 40px 20px;
            position: relative;
        }

        .container::before {
            content: '> RSS_FEED.XML';
            position: absolute;
            top: -35px;
            left: 20px;
            font-size: 0.85em;
            color: #00ff41;
            opacity: 0.6;
            letter-spacing: 2px;
        }

        header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 2px solid rgba(24, 210, 110, 0.3);
        }

        .rss-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 20px;
            background: rgba(0, 255, 65, 0.1);
            border: 2px solid #00ff41;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            box-shadow: 0 0 25px rgba(0, 255, 65, 0.4);
            position: relative;
        }


        h1 {
            color: #00ff41;
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
            text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
            letter-spacing: 2px;
        }

        h1::before {
            content: '█';
            color: #00ff41;
            opacity: 0.7;
            animation: blink 1.2s infinite;
            font-size: 0.7em;
            margin-right: 38px;
            display: inline-block;
            vertical-align: middle;
            border-radius: 2px;
            box-shadow: 0 0 8px rgba(0, 255, 65, 0.4);
        }

        .subtitle {
            color: #00cc33;
            font-size: 1.1em;
            margin-bottom: 20px;
            font-family: 'Courier New', monospace;
        }

        .info-box {
            background: rgba(0, 0, 0, 0.5);
            border: 0.5px solid rgba(24, 210, 110, 0.2);
            box-shadow: 0 0 20px rgba(24, 210, 110, 0.15);
            padding: 25px;
            margin: 30px 0;
            border-radius: 8px;
        }

        .info-box h2 {
            color: #00ff41;
            font-size: 1.3em;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .info-box h2::before {
            content: '// ';
            opacity: 0.5;
        }

        .info-box p {
            margin-bottom: 12px;
            color: #00cc33;
            line-height: 1.7;
        }

        .how-to-subscribe {
            background: rgba(0, 0, 0, 0.5);
            border: 0.5px solid rgba(24, 210, 110, 0.2);
            box-shadow: 0 0 20px rgba(24, 210, 110, 0.15);
            padding: 25px;
            margin: 30px 0;
            border-radius: 8px;
        }

        .how-to-subscribe h2 {
            color: #00ff41;
            font-size: 1.3em;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .how-to-subscribe h2::before {
            content: '// ';
            opacity: 0.5;
        }

        .how-to-subscribe ol {
            margin-left: 20px;
            color: #00cc33;
        }

        .how-to-subscribe li {
            margin-bottom: 10px;
            line-height: 1.6;
        }

        .feed-url-container {
            position: relative;
            margin: 15px 0;
        }

        .feed-url {
            background: rgba(0, 0, 0, 0.8);
            padding: 12px 70px 12px 15px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: #00ff41;
            border: 1px solid #00ff41;
            word-break: break-all;
            text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
        }

        .feed-url::before {
            content: '$ ';
            color: #00ff41;
            font-weight: bold;
        }

        .copy-btn {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 255, 65, 0.2);
            border: 1px solid #00ff41;
            color: #00ff41;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85em;
            transition: all 0.3s ease;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .copy-btn:hover {
            background: rgba(0, 255, 65, 0.3);
            border-color: #00ff41;
            box-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
            transform: translateY(-50%) scale(1.05);
        }

        .copy-btn:active {
            transform: translateY(-50%) scale(0.95);
        }

        .copy-btn.copied {
            background: rgba(24, 210, 110, 0.3);
            border-color: #18d26e;
        }

        .readers-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin: 15px 0;
        }

        .reader-link {
            background: rgba(0, 0, 0, 0.8);
            padding: 12px;
            border-radius: 4px;
            text-align: center;
            color: #00ff41;
            text-decoration: none;
            border: 1px solid #00ff41;
            box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
            transition: all 0.3s ease;
            font-size: 0.9em;
            font-family: 'Courier New', monospace;
        }

        .reader-link:hover {
            background: rgba(0, 255, 65, 0.1);
            border-color: #00ff41;
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.4);
            transform: translateY(-2px);
        }

        .posts-section {
            margin-top: 40px;
        }

        .posts-section h2 {
            color: #00ff41;
            font-size: 1.8em;
            margin-bottom: 25px;
            padding-bottom: 10px;
            border-bottom: 2px solid #00ff41;
        }

        .posts-section h2::before {
            content: '> ';
            opacity: 0.7;
        }

        .post-item {
            background: rgba(0, 0, 0, 0.5);
            border: 0.5px solid rgba(24, 210, 110, 0.1);
            box-shadow: 0 0 15px rgba(24, 210, 110, 0.1);
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }

        .post-item:hover {
            border-color: rgba(24, 210, 110, 0.3);
            box-shadow: 0 0 25px rgba(24, 210, 110, 0.2);
            transform: translateY(-2px);
        }

        .post-title {
            font-size: 1.5em;
            margin-bottom: 10px;
        }

        .post-title a {
            color: #00ff41;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .post-title a::before {
            content: '[+] ';
            opacity: 0.6;
        }

        .post-title a:hover {
            color: #00ff41;
            text-shadow: 0 0 10px rgba(0, 255, 65, 0.7);
            text-decoration: underline;
        }

        .post-meta {
            color: #00cc33;
            font-size: 0.9em;
            margin-bottom: 12px;
        }

        .post-category {
            display: inline-block;
            background: rgba(0, 255, 65, 0.1);
            color: #00ff41;
            padding: 4px 12px;
            border-radius: 3px;
            font-size: 0.85em;
            margin-right: 10px;
            border: 1px solid #00ff41;
        }

        .post-category::before {
            content: '# ';
        }

        .post-description {
            color: #00cc33;
            line-height: 1.7;
        }

        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid #00ff41;
            color: #00cc33;
        }

        .footer a {
            color: #00ff41;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .footer a:hover {
            color: #00ff41;
            text-shadow: 0 0 10px rgba(0, 255, 65, 0.7);
            text-decoration: underline;
        }

        /* Tablet */
        @media (max-width: 768px) {
            body {
                padding: 30px 15px 20px;
            }

            .container {
                padding: 30px 20px;
                border-width: 1.5px;
            }

            .container::before {
                font-size: 0.75em;
                left: 15px;
            }

            h1 {
                font-size: 2em;
                letter-spacing: 1px;
            }

            h1::before {
                margin-right: 25px;
                font-size: 0.65em;
            }

            .subtitle {
                font-size: 1em;
            }

            .info-box, .how-to-subscribe {
                padding: 20px;
                margin: 25px 0;
            }

            .readers-list {
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 8px;
            }

            .post-item {
                padding: 20px;
            }
        }

        /* Mobile */
        @media (max-width: 480px) {
            body {
                padding: 25px 10px 15px;
                background-size: 15px 15px;
            }

            .container {
                padding: 25px 15px;
                border-width: 1px;
            }

            .container::before {
                display: none; /* Hide on very small screens */
            }

            .rss-icon {
                width: 48px;
                height: 48px;
                font-size: 24px;
                margin-bottom: 15px;
            }

            h1 {
                font-size: 1.6em;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
            }

            h1::before {
                margin-right: 15px;
                font-size: 0.6em;
            }

            .subtitle {
                font-size: 0.9em;
                margin-bottom: 15px;
            }

            .feed-url {
                padding: 10px 60px 10px 10px;
                font-size: 0.75em;
                word-break: break-all;
            }

            .copy-btn {
                padding: 5px 10px;
                font-size: 0.75em;
                right: 5px;
            }

            .info-box, .how-to-subscribe {
                padding: 15px;
                margin: 20px 0;
                border-radius: 6px;
            }

            .info-box h2, .how-to-subscribe h2 {
                font-size: 1.1em;
                margin-bottom: 12px;
            }

            .info-box p, .how-to-subscribe p, .how-to-subscribe li {
                font-size: 0.9em;
                line-height: 1.6;
            }

            .how-to-subscribe ol {
                margin-left: 15px;
            }

            .readers-list {
                grid-template-columns: 1fr 1fr;
                gap: 6px;
            }

            .reader-link {
                padding: 10px 8px;
                font-size: 0.8em;
            }

            .posts-section h2 {
                font-size: 1.5em;
                margin-bottom: 20px;
            }

            .post-item {
                padding: 15px;
                margin-bottom: 15px;
                border-radius: 6px;
            }

            .post-title {
                font-size: 1.2em;
            }

            .post-title a::before {
                content: '[+] ';
                display: inline;
            }

            .post-meta {
                font-size: 0.85em;
            }

            .post-category {
                font-size: 0.75em;
                padding: 3px 10px;
            }

            .post-description {
                font-size: 0.9em;
            }

            .footer {
                margin-top: 40px;
                padding-top: 20px;
                font-size: 0.9em;
            }
        }

        /* Very small screens */
        @media (max-width: 360px) {
            body {
                padding: 20px 8px 12px;
            }

            .container {
                padding: 20px 12px;
            }

            h1 {
                font-size: 1.4em;
            }

            h1::before {
                margin-right: 10px;
            }

            .readers-list {
                grid-template-columns: 1fr;
            }

            .post-title {
                font-size: 1.1em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="rss-icon">📡</div>
            <h1><xsl:value-of select="rss/channel/title"/></h1>
            <p class="subtitle"><xsl:value-of select="rss/channel/description"/></p>
            <div class="feed-url-container">
                <div class="feed-url" id="feed-url">
                    <xsl:value-of select="rss/channel/atom:link[@rel='self']/@href"/>
                </div>
                <button class="copy-btn" id="copy-btn">Copy</button>
            </div>
        </header>

        <div class="info-box">
            <h2>🤔 What is RSS?</h2>
            <p>
                RSS (Really Simple Syndication) is a web feed that allows you to stay updated with new content
                from this blog without visiting the website manually. Think of it as a direct subscription to my content!
            </p>
            <p>
                When I publish a new article, your RSS reader automatically notifies you. No algorithms, no ads,
                no distractions—just pure content delivered straight to you.
            </p>
        </div>

        <div class="how-to-subscribe">
            <h2>📥 How to Subscribe</h2>
            <ol>
                <li><strong>Get an RSS Reader:</strong> Choose from popular options like Feedly, Inoreader, NetNewsWire, or any other RSS reader you prefer.</li>
                <li><strong>Copy the Feed URL:</strong> Copy the URL shown above in the green box.</li>
                <li><strong>Add to Your Reader:</strong> Paste the URL into your RSS reader's "Add Feed" or "Subscribe" option.</li>
                <li><strong>Stay Updated:</strong> You'll now receive notifications whenever I publish new content!</li>
            </ol>

            <p style="margin-top: 20px;"><strong>Popular RSS Readers:</strong></p>
            <div class="readers-list">
                <a href="https://feedly.com/" target="_blank" rel="noopener noreferrer" class="reader-link">Feedly</a>
                <a href="https://www.inoreader.com/" target="_blank" rel="noopener noreferrer" class="reader-link">Inoreader</a>
                <a href="https://netnewswire.com/" target="_blank" rel="noopener noreferrer" class="reader-link">NetNewsWire</a>
                <a href="https://theoldreader.com/" target="_blank" rel="noopener noreferrer" class="reader-link">The Old Reader</a>
            </div>
        </div>

        <section class="posts-section">
            <h2>📝 Recent Posts (<xsl:value-of select="count(rss/channel/item)"/>)</h2>

            <xsl:for-each select="rss/channel/item">
                <article class="post-item">
                    <h3 class="post-title">
                        <a href="{link}" target="_blank" rel="noopener noreferrer">
                            <xsl:value-of select="title"/>
                        </a>
                    </h3>

                    <div class="post-meta">
                        <xsl:if test="category">
                            <span class="post-category"><xsl:value-of select="category"/></span>
                        </xsl:if>
                        <span>Published: <xsl:value-of select="pubDate"/></span>
                    </div>

                    <p class="post-description">
                        <xsl:value-of select="description"/>
                    </p>
                </article>
            </xsl:for-each>
        </section>

        <footer class="footer">
            <p>
                This is an RSS feed. Visit <a href="{rss/channel/link}"><xsl:value-of select="rss/channel/link"/></a> to view the blog in your browser.
            </p>
            <p style="margin-top: 10px; font-size: 0.9em;">
                Last Updated: <xsl:value-of select="rss/channel/lastBuildDate"/>
            </p>
        </footer>
    </div>

    <script>
    <xsl:text disable-output-escaping="yes">
    <![CDATA[
        // Add click event listener to copy button
        document.addEventListener('DOMContentLoaded', function() {
            const copyBtn = document.getElementById('copy-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', function() {
                    copyFeedUrl();
                });
            }
        });

        function copyFeedUrl() {
            const feedUrl = document.getElementById('feed-url').textContent.trim();
            const copyBtn = document.getElementById('copy-btn');

            // Modern clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(feedUrl).then(function() {
                    copyBtn.textContent = 'Copied!';
                    copyBtn.classList.add('copied');

                    setTimeout(function() {
                        copyBtn.textContent = 'Copy';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                }).catch(function(err) {
                    console.error('Failed to copy:', err);
                    fallbackCopy(feedUrl, copyBtn);
                });
            } else {
                // Fallback for older browsers
                fallbackCopy(feedUrl, copyBtn);
            }
        }

        function fallbackCopy(text, btn) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                btn.textContent = 'Copied!';
                btn.classList.add('copied');

                setTimeout(function() {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Fallback copy failed:', err);
                btn.textContent = 'Failed';
                setTimeout(function() {
                    btn.textContent = 'Copy';
                }, 2000);
            }

            document.body.removeChild(textArea);
        }
    ]]>
    </xsl:text>
    </script>
</body>
</html>
</xsl:template>

</xsl:stylesheet>
