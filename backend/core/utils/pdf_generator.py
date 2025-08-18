"""
PDF領収書ジェネレータ
ギフト交換時の領収書をPDF形式で生成
"""
import os
import io
from datetime import datetime
from typing import Dict, Any, Optional

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.platypus.flowables import HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

class GiftReceiptPDFGenerator:
    """ギフト交換領収書PDF生成クラス"""
    
    def __init__(self):
        self.page_size = A4
        self.margin = 20 * mm
        
        # 日本語フォントの設定（システムにインストールされている場合）
        try:
            # macOSの場合
            if os.path.exists('/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc'):
                pdfmetrics.registerFont(TTFont('Japanese', '/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc'))
            # Windowsの場合
            elif os.path.exists('C:/Windows/Fonts/msgothic.ttc'):
                pdfmetrics.registerFont(TTFont('Japanese', 'C:/Windows/Fonts/msgothic.ttc'))
            else:
                # デフォルトフォントを使用
                pass
        except:
            # フォント登録に失敗した場合はデフォルトを使用
            pass
    
    def generate_receipt(self, exchange_data: Dict[str, Any]) -> bytes:
        """
        ギフト交換領収書PDFを生成
        
        Args:
            exchange_data: 交換データ
                - exchange_code: 交換コード
                - user_name: ユーザー名
                - gift_name: ギフト名
                - points_spent: 使用ポイント
                - original_price: 元値
                - exchange_date: 交換日時
                - provider_name: 提供者名
                - digital_code: デジタルコード（該当する場合）
        
        Returns:
            bytes: PDF データ
        """
        buffer = io.BytesIO()
        
        # PDFドキュメントの作成
        doc = SimpleDocTemplate(
            buffer,
            pagesize=self.page_size,
            rightMargin=self.margin,
            leftMargin=self.margin,
            topMargin=self.margin,
            bottomMargin=self.margin
        )
        
        # ストーリー（コンテンツ）の構築
        story = []
        
        # スタイルの設定
        styles = self._get_styles()
        
        # ヘッダー
        story.extend(self._create_header(exchange_data, styles))
        
        # 交換情報テーブル
        story.extend(self._create_exchange_info_table(exchange_data, styles))
        
        # デジタルコード（該当する場合）
        if exchange_data.get('digital_code'):
            story.extend(self._create_digital_code_section(exchange_data, styles))
        
        # フッター
        story.extend(self._create_footer(exchange_data, styles))
        
        # PDFの構築
        doc.build(story)
        
        # バイトデータとして返す
        buffer.seek(0)
        return buffer.getvalue()
    
    def _get_styles(self) -> Dict[str, ParagraphStyle]:
        """スタイルシートの取得"""
        styles = getSampleStyleSheet()
        
        custom_styles = {
            'title': ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=18,
                spaceAfter=20,
                alignment=TA_CENTER,
                textColor=colors.HexColor('#e11d48')  # rose-600
            ),
            'subtitle': ParagraphStyle(
                'CustomSubtitle',
                parent=styles['Heading2'],
                fontSize=14,
                spaceAfter=10,
                alignment=TA_LEFT,
                textColor=colors.HexColor('#be185d')  # pink-700
            ),
            'normal': ParagraphStyle(
                'CustomNormal',
                parent=styles['Normal'],
                fontSize=10,
                spaceAfter=6
            ),
            'small': ParagraphStyle(
                'CustomSmall',
                parent=styles['Normal'],
                fontSize=8,
                textColor=colors.grey
            ),
            'center': ParagraphStyle(
                'CustomCenter',
                parent=styles['Normal'],
                fontSize=10,
                alignment=TA_CENTER
            ),
            'right': ParagraphStyle(
                'CustomRight',
                parent=styles['Normal'],
                fontSize=10,
                alignment=TA_RIGHT
            )
        }
        
        return custom_styles
    
    def _create_header(self, exchange_data: Dict[str, Any], styles: Dict[str, ParagraphStyle]) -> list:
        """ヘッダーの作成"""
        elements = []
        
        # タイトル
        elements.append(Paragraph("ギフト交換領収書", styles['title']))
        elements.append(Spacer(1, 10 * mm))
        
        # 会社情報と交換情報のテーブル
        header_data = [
            ['発行者:', 'biid Point System', '交換コード:', exchange_data.get('exchange_code', '')],
            ['発行日:', datetime.now().strftime('%Y年%m月%d日'), '交換日時:', 
             self._format_datetime(exchange_data.get('exchange_date', ''))],
            ['', '', 'お客様:', exchange_data.get('user_name', '')]
        ]
        
        header_table = Table(header_data, colWidths=[25*mm, 50*mm, 25*mm, 50*mm])
        header_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#be185d')),
            ('TEXTCOLOR', (2, 0), (2, -1), colors.HexColor('#be185d')),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
        ]))
        
        elements.append(header_table)
        elements.append(Spacer(1, 15 * mm))
        
        return elements
    
    def _create_exchange_info_table(self, exchange_data: Dict[str, Any], styles: Dict[str, ParagraphStyle]) -> list:
        """交換情報テーブルの作成"""
        elements = []
        
        # セクションタイトル
        elements.append(Paragraph("交換内容", styles['subtitle']))
        elements.append(Spacer(1, 5 * mm))
        
        # 交換内容テーブル
        exchange_info_data = [
            ['項目', '内容', '金額'],
            ['ギフト名', exchange_data.get('gift_name', ''), ''],
            ['提供元', exchange_data.get('provider_name', ''), ''],
            ['使用ポイント', f"{exchange_data.get('points_spent', 0):,} pt", f"¥{exchange_data.get('original_price', 0):,}相当"],
            ['', '', ''],
            ['', '合計', f"¥{exchange_data.get('original_price', 0):,}"]
        ]
        
        exchange_table = Table(exchange_info_data, colWidths=[40*mm, 80*mm, 30*mm])
        exchange_table.setStyle(TableStyle([
            # ヘッダー行
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#fce7f3')),  # pink-100
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#be185d')),   # pink-700
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            
            # データ行
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ALIGN', (0, 1), (0, -1), 'LEFT'),
            ('ALIGN', (1, 1), (1, -1), 'LEFT'),
            ('ALIGN', (2, 1), (2, -1), 'RIGHT'),
            
            # 合計行
            ('FONTNAME', (1, -1), (-1, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (1, -1), (-1, -1), colors.HexColor('#f3f4f6')),  # gray-100
            
            # 罫線
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db')),  # gray-300
            ('LINEBELOW', (0, 0), (-1, 0), 2, colors.HexColor('#be185d')),  # pink-700
        ]))
        
        elements.append(exchange_table)
        elements.append(Spacer(1, 15 * mm))
        
        return elements
    
    def _create_digital_code_section(self, exchange_data: Dict[str, Any], styles: Dict[str, ParagraphStyle]) -> list:
        """デジタルコードセクションの作成"""
        elements = []
        
        # セクションタイトル
        elements.append(Paragraph("デジタルギフト情報", styles['subtitle']))
        elements.append(Spacer(1, 5 * mm))
        
        # デジタルコードの表示
        code_data = [
            ['デジタルコード', exchange_data.get('digital_code', '')],
            ['利用方法', 'このコードを提供元サイトでご利用ください。'],
            ['注意事項', '・このコードは第三者に教えないでください。\n・有効期限がある場合があります。\n・詳細は提供元にお問い合わせください。']
        ]
        
        code_table = Table(code_data, colWidths=[30*mm, 120*mm])
        code_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (0, 1), (0, 1), colors.HexColor('#fef3c7')),  # yellow-100
            ('FONTNAME', (1, 1), (1, 1), 'Courier-Bold'),
            ('FONTSIZE', (1, 1), (1, 1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db')),
        ]))
        
        elements.append(code_table)
        elements.append(Spacer(1, 15 * mm))
        
        return elements
    
    def _create_footer(self, exchange_data: Dict[str, Any], styles: Dict[str, ParagraphStyle]) -> list:
        """フッターの作成"""
        elements = []
        
        # 区切り線
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#d1d5db')))
        elements.append(Spacer(1, 5 * mm))
        
        # 注意事項
        footer_text = """
        <b>重要な注意事項:</b><br/>
        • この領収書は再発行できません。大切に保管してください。<br/>
        • ポイントの返還・交換はできません。<br/>
        • ギフトの利用に関するお問い合わせは提供元にご連絡ください。<br/>
        • システムに関するお問い合わせ: support@biid-point.com
        """
        
        elements.append(Paragraph(footer_text, styles['small']))
        elements.append(Spacer(1, 10 * mm))
        
        # 発行情報
        issue_info = f"発行システム: biid Point System v1.0 | 発行日時: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        elements.append(Paragraph(issue_info, styles['center']))
        
        return elements
    
    def _format_datetime(self, date_str: str) -> str:
        """日時文字列のフォーマット"""
        try:
            if isinstance(date_str, str):
                # ISO 8601 形式の場合
                dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                return dt.strftime('%Y年%m月%d日 %H:%M')
            elif hasattr(date_str, 'strftime'):
                return date_str.strftime('%Y年%m月%d日 %H:%M')
            else:
                return str(date_str)
        except:
            return str(date_str)


def generate_gift_receipt_pdf(exchange_data: Dict[str, Any]) -> bytes:
    """
    ギフト交換領収書PDF生成のコンビニエンス関数
    
    Args:
        exchange_data: 交換データ
    
    Returns:
        bytes: PDF データ
    """
    generator = GiftReceiptPDFGenerator()
    return generator.generate_receipt(exchange_data)