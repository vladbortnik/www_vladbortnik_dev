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
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
            color: #e0e0e0;
            line-height: 1.6;
            padding: 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(24, 210, 110, 0.1);
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
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }

        h1 {
            color: #18d26e;
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .subtitle {
            color: #a0a0a0;
            font-size: 1.1em;
            margin-bottom: 20px;
        }

        .info-box {
            background: rgba(24, 210, 110, 0.08);
            border-left: 4px solid #18d26e;
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
        }

        .info-box h2 {
            color: #18d26e;
            font-size: 1.4em;
            margin-bottom: 15px;
        }

        .info-box p {
            margin-bottom: 12px;
            color: #c0c0c0;
        }

        .how-to-subscribe {
            background: rgba(59, 130, 246, 0.08);
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
        }

        .how-to-subscribe h2 {
            color: #3b82f6;
            font-size: 1.4em;
            margin-bottom: 15px;
        }

        .how-to-subscribe ol {
            margin-left: 20px;
            color: #c0c0c0;
        }

        .how-to-subscribe li {
            margin-bottom: 10px;
        }

        .feed-url-container {
            position: relative;
            margin: 15px 0;
        }

        .feed-url {
            background: rgba(0, 0, 0, 0.3);
            padding: 12px 70px 12px 15px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            color: #18d26e;
            border: 1px solid rgba(24, 210, 110, 0.2);
            word-break: break-all;
        }

        .copy-btn {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(24, 210, 110, 0.15);
            border: 1px solid rgba(24, 210, 110, 0.3);
            color: #18d26e;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85em;
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .copy-btn:hover {
            background: rgba(24, 210, 110, 0.25);
            border-color: #18d26e;
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
            background: rgba(255, 255, 255, 0.05);
            padding: 10px;
            border-radius: 6px;
            text-align: center;
            color: #18d26e;
            text-decoration: none;
            border: 1px solid rgba(24, 210, 110, 0.2);
            transition: all 0.3s ease;
        }

        .reader-link:hover {
            background: rgba(24, 210, 110, 0.1);
            border-color: #18d26e;
            transform: translateY(-2px);
        }

        .posts-section {
            margin-top: 40px;
        }

        .posts-section h2 {
            color: #18d26e;
            font-size: 1.8em;
            margin-bottom: 25px;
            padding-bottom: 10px;
            border-bottom: 2px solid rgba(24, 210, 110, 0.3);
        }

        .post-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(24, 210, 110, 0.15);
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }

        .post-item:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(24, 210, 110, 0.3);
            transform: translateX(5px);
        }

        .post-title {
            font-size: 1.5em;
            margin-bottom: 10px;
        }

        .post-title a {
            color: #18d26e;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .post-title a:hover {
            color: #20f080;
            text-decoration: underline;
        }

        .post-meta {
            color: #888;
            font-size: 0.9em;
            margin-bottom: 12px;
        }

        .post-category {
            display: inline-block;
            background: rgba(24, 210, 110, 0.15);
            color: #18d26e;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.85em;
            margin-right: 10px;
            border: 1px solid rgba(24, 210, 110, 0.3);
        }

        .post-description {
            color: #b0b0b0;
            line-height: 1.7;
        }

        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: #888;
        }

        .footer a {
            color: #18d26e;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        @media (max-width: 768px) {
            .container {
                padding: 25px;
            }

            h1 {
                font-size: 1.8em;
            }

            .readers-list {
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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
