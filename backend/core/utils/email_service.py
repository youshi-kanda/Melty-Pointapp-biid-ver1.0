"""
SES メール送信ユーティリティ
ギフト交換時の通知メール送信
"""
import os
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)

class SESEmailService:
    """AWS SES メール送信サービス"""
    
    def __init__(self):
        """SESクライアントの初期化"""
        try:
            # AWS設定
            self.region = getattr(settings, 'AWS_SES_REGION', 'ap-northeast-1')
            self.from_email = getattr(settings, 'AWS_SES_FROM_EMAIL', 'noreply@biid-point.com')
            
            # SESクライアントの作成
            self.ses_client = boto3.client(
                'ses',
                region_name=self.region,
                aws_access_key_id=getattr(settings, 'AWS_ACCESS_KEY_ID', None),
                aws_secret_access_key=getattr(settings, 'AWS_SECRET_ACCESS_KEY', None)
            )
            
            self.is_available = True
            logger.info("SES Email Service initialized successfully")
            
        except (NoCredentialsError, Exception) as e:
            logger.warning(f"SES Email Service initialization failed: {e}")
            self.is_available = False
            self.ses_client = None
    
    def send_gift_exchange_notification(self, exchange_data: Dict[str, Any], pdf_attachment: Optional[bytes] = None) -> bool:
        """
        ギフト交換完了通知メールの送信
        
        Args:
            exchange_data: 交換データ
            pdf_attachment: PDF領収書（オプション）
        
        Returns:
            bool: 送信成功の可否
        """
        if not self.is_available:
            logger.warning("SES service is not available")
            return False
        
        try:
            # メール内容の生成
            subject = f"【biid Point】ギフト交換完了のお知らせ - {exchange_data.get('gift_name', '')}"
            
            # HTMLメールの生成
            html_body = self._generate_gift_exchange_html(exchange_data)
            text_body = strip_tags(html_body)
            
            # 受信者情報
            recipient_email = exchange_data.get('recipient_email') or exchange_data.get('user_email')
            recipient_name = exchange_data.get('recipient_name') or exchange_data.get('user_name')
            
            if not recipient_email:
                logger.error("Recipient email is not provided")
                return False
            
            # メール送信
            return self._send_email(
                to_email=recipient_email,
                to_name=recipient_name,
                subject=subject,
                html_body=html_body,
                text_body=text_body,
                pdf_attachment=pdf_attachment
            )
            
        except Exception as e:
            logger.error(f"Failed to send gift exchange notification: {e}")
            return False
    
    def _generate_gift_exchange_html(self, exchange_data: Dict[str, Any]) -> str:
        """ギフト交換通知メールのHTMLを生成"""
        
        # HTMLテンプレート
        html_template = """
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ギフト交換完了のお知らせ</title>
            <style>
                body {
                    font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans CJK JP', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #ec4899, #f43f5e);
                    color: white;
                    padding: 20px;
                    border-radius: 10px 10px 0 0;
                    text-align: center;
                }
                .content {
                    background: #fff;
                    padding: 30px;
                    border: 1px solid #e5e7eb;
                    border-top: none;
                }
                .gift-info {
                    background: #fef3c7;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #f59e0b;
                }
                .digital-code {
                    background: #dbeafe;
                    padding: 15px;
                    border-radius: 8px;
                    font-family: 'Courier New', monospace;
                    font-size: 18px;
                    font-weight: bold;
                    text-align: center;
                    letter-spacing: 2px;
                    border: 2px dashed #3b82f6;
                }
                .footer {
                    background: #f9fafb;
                    padding: 20px;
                    border-radius: 0 0 10px 10px;
                    border: 1px solid #e5e7eb;
                    border-top: none;
                    font-size: 12px;
                    color: #6b7280;
                }
                .btn {
                    display: inline-block;
                    background: linear-gradient(135deg, #ec4899, #f43f5e);
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                    margin: 10px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                }
                td {
                    padding: 8px;
                    border-bottom: 1px solid #e5e7eb;
                }
                .label {
                    font-weight: bold;
                    color: #be185d;
                    width: 120px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎁 ギフト交換完了</h1>
                <p>biid Point System</p>
            </div>
            
            <div class="content">
                <p>{{ user_name }}様</p>
                
                <p>いつもbiid Pointをご利用いただき、ありがとうございます。<br>
                ギフト交換が正常に完了いたしました。</p>
                
                <div class="gift-info">
                    <h3>🎯 交換内容</h3>
                    <table>
                        <tr>
                            <td class="label">交換コード:</td>
                            <td><strong>{{ exchange_code }}</strong></td>
                        </tr>
                        <tr>
                            <td class="label">ギフト名:</td>
                            <td>{{ gift_name }}</td>
                        </tr>
                        <tr>
                            <td class="label">提供元:</td>
                            <td>{{ provider_name }}</td>
                        </tr>
                        <tr>
                            <td class="label">使用ポイント:</td>
                            <td>{{ points_spent }} pt (¥{{ original_price }} 相当)</td>
                        </tr>
                        <tr>
                            <td class="label">交換日時:</td>
                            <td>{{ exchange_date }}</td>
                        </tr>
                    </table>
                </div>
                
                {% if digital_code %}
                <div style="margin: 25px 0;">
                    <h3>💳 デジタルギフトコード</h3>
                    <div class="digital-code">
                        {{ digital_code }}
                    </div>
                    <p style="font-size: 14px; color: #ef4444; margin-top: 10px;">
                        ⚠️ このコードは第三者に教えないでください。スクリーンショットを保存することをお勧めします。
                    </p>
                </div>
                {% endif %}
                
                <div style="margin: 25px 0;">
                    <h3>📋 次のステップ</h3>
                    <ol>
                        <li>添付の領収書をダウンロード・保存してください</li>
                        {% if digital_code %}
                        <li>上記のデジタルコードを提供元サイトでご利用ください</li>
                        {% else %}
                        <li>ギフトの受け取り方法については、提供元からの連絡をお待ちください</li>
                        {% endif %}
                        <li>ご不明な点がございましたら、お気軽にお問い合わせください</li>
                    </ol>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://app.biid-point.com/user/history" class="btn">
                        📊 ポイント履歴を確認
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>重要な注意事項:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>この領収書は再発行できません。大切に保管してください。</li>
                    <li>ポイントの返還・交換はできません。</li>
                    <li>ギフトの利用に関するお問い合わせは提供元にご連絡ください。</li>
                </ul>
                
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #e5e7eb;">
                
                <p>このメールに心当たりがない場合は、下記までご連絡ください。<br>
                biid Point サポート: support@biid-point.com</p>
                
                <p style="margin-top: 20px; font-size: 11px; color: #9ca3af;">
                    © 2025 biid Point System. All rights reserved.<br>
                    このメールは自動送信されています。返信はできません。
                </p>
            </div>
        </body>
        </html>
        """
        
        # テンプレート変数の置換
        html_content = html_template
        for key, value in exchange_data.items():
            placeholder = f"{{{{ {key} }}}}"
            html_content = html_content.replace(placeholder, str(value))
        
        # 条件分岐の処理
        if exchange_data.get('digital_code'):
            html_content = html_content.replace('{% if digital_code %}', '')
            html_content = html_content.replace('{% else %}', '<!--')
            html_content = html_content.replace('{% endif %}', '-->')
        else:
            html_content = html_content.replace('{% if digital_code %}', '<!--')
            html_content = html_content.replace('{% else %}', '-->')
            html_content = html_content.replace('{% endif %}', '')
        
        return html_content
    
    def _send_email(self, to_email: str, to_name: str, subject: str, 
                   html_body: str, text_body: str, pdf_attachment: Optional[bytes] = None) -> bool:
        """
        実際のメール送信処理
        
        Args:
            to_email: 宛先メールアドレス
            to_name: 宛先名
            subject: 件名
            html_body: HTMLメール本文
            text_body: テキストメール本文
            pdf_attachment: PDF添付ファイル
        
        Returns:
            bool: 送信成功の可否
        """
        try:
            # 基本的なメール設定
            destination = {
                'ToAddresses': [to_email]
            }
            
            message = {
                'Subject': {
                    'Data': subject,
                    'Charset': 'UTF-8'
                },
                'Body': {
                    'Text': {
                        'Data': text_body,
                        'Charset': 'UTF-8'
                    },
                    'Html': {
                        'Data': html_body,
                        'Charset': 'UTF-8'
                    }
                }
            }
            
            # PDF添付ファイルがある場合は raw email として送信
            if pdf_attachment:
                return self._send_raw_email_with_attachment(
                    to_email, to_name, subject, html_body, text_body, pdf_attachment
                )
            else:
                # 通常のメール送信
                response = self.ses_client.send_email(
                    Source=self.from_email,
                    Destination=destination,
                    Message=message
                )
                
                logger.info(f"Email sent successfully. Message ID: {response['MessageId']}")
                return True
                
        except ClientError as e:
            logger.error(f"SES ClientError: {e.response['Error']['Message']}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error sending email: {e}")
            return False
    
    def _send_raw_email_with_attachment(self, to_email: str, to_name: str, subject: str,
                                      html_body: str, text_body: str, pdf_attachment: bytes) -> bool:
        """PDF添付ファイル付きメールの送信"""
        import email.mime.multipart
        import email.mime.text
        import email.mime.application
        import base64
        
        try:
            # MIMEメッセージの作成
            msg = email.mime.multipart.MIMEMultipart('mixed')
            msg['Subject'] = subject
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            # メール本文部分
            body_part = email.mime.multipart.MIMEMultipart('alternative')
            
            # テキスト部分
            text_part = email.mime.text.MIMEText(text_body, 'plain', 'utf-8')
            body_part.attach(text_part)
            
            # HTML部分
            html_part = email.mime.text.MIMEText(html_body, 'html', 'utf-8')
            body_part.attach(html_part)
            
            msg.attach(body_part)
            
            # PDF添付ファイル
            if pdf_attachment:
                attachment = email.mime.application.MIMEApplication(pdf_attachment)
                attachment.add_header(
                    'Content-Disposition',
                    'attachment',
                    filename=f'gift_receipt_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
                )
                msg.attach(attachment)
            
            # Raw メール送信
            response = self.ses_client.send_raw_email(
                Source=self.from_email,
                Destinations=[to_email],
                RawMessage={'Data': msg.as_string()}
            )
            
            logger.info(f"Raw email with attachment sent successfully. Message ID: {response['MessageId']}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send raw email with attachment: {e}")
            return False
    
    def test_connection(self) -> bool:
        """SES接続テスト"""
        if not self.is_available:
            return False
        
        try:
            # SES sending quota の確認
            response = self.ses_client.get_send_quota()
            logger.info(f"SES connection test successful. Quota: {response}")
            return True
        except Exception as e:
            logger.error(f"SES connection test failed: {e}")
            return False


# グローバルインスタンス
email_service = SESEmailService()


def send_gift_exchange_notification(exchange_data: Dict[str, Any], pdf_attachment: Optional[bytes] = None) -> bool:
    """
    ギフト交換通知メール送信のコンビニエンス関数
    
    Args:
        exchange_data: 交換データ
        pdf_attachment: PDF領収書
    
    Returns:
        bool: 送信成功の可否
    """
    return email_service.send_gift_exchange_notification(exchange_data, pdf_attachment)