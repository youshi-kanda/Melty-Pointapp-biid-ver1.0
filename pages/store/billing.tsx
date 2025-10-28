import { useState } from 'react';
import Head from 'next/head';
import StoreSidebar from '../../components/store/Sidebar';
import { FileText, Download, CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';

export default function StoreBilling() {
  const billings = [
    { id: 'BILL-2024-01', month: '2024年1月', sales: 2850000, fee: 142500, net: 2707500, status: '支払済み', date: '2024-02-05' },
    { id: 'BILL-2023-12', month: '2023年12月', sales: 3200000, fee: 160000, net: 3040000, status: '支払済み', date: '2024-01-05' },
    { id: 'BILL-2023-11', month: '2023年11月', sales: 2650000, fee: 132500, net: 2517500, status: '支払済み', date: '2023-12-05' },
    { id: 'BILL-2023-10', month: '2023年10月', sales: 2900000, fee: 145000, net: 2755000, status: '未払い', date: '-' },
  ];

  return (
    <>
      <Head>
        <title>請求管理 - Melty+ 店舗管理</title>
      </Head>

      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar currentPage="billing" />

        <main className="flex-1 lg:ml-64">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                請求管理
              </h1>
              <p className="text-sm text-gray-600 mt-1">月次請求と支払状況を管理します</p>
            </div>
          </header>

          <div className="p-6">
            {/* サマリーカード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <DollarSign size={24} className="text-white" />
                  </div>
                  <TrendingUp size={20} className="text-green-600" />
                </div>
                <h3 className="text-sm text-gray-600 font-medium mb-1">今月の売上</h3>
                <p className="text-2xl font-bold text-gray-900">¥2,850,000</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                    <FileText size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 font-medium mb-1">手数料（5%）</h3>
                <p className="text-2xl font-bold text-gray-900">¥142,500</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <CheckCircle size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-600 font-medium mb-1">純利益</h3>
                <p className="text-2xl font-bold text-green-600">¥2,707,500</p>
              </div>
            </div>

            {/* 請求一覧 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">請求履歴</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">請求ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">対象月</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">売上</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">手数料</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">純利益</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">支払日</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {billings.map((billing) => (
                      <tr key={billing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm">{billing.id}</td>
                        <td className="px-6 py-4 font-medium">{billing.month}</td>
                        <td className="px-6 py-4 font-semibold">¥{billing.sales.toLocaleString()}</td>
                        <td className="px-6 py-4 text-red-600 font-medium">-¥{billing.fee.toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold text-green-600">¥{billing.net.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                            billing.status === '支払済み' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {billing.status === '支払済み' ? <CheckCircle size={12} /> : <Clock size={12} />}
                            {billing.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{billing.date}</td>
                        <td className="px-6 py-4">
                          <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
                            <Download size={18} className="text-purple-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
