import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Car, Calendar, CreditCard, Phone, MapPin, AlertCircle } from 'lucide-react';

const formatCurrency = (value: string | undefined) => {
  if (!value) return '';
  return value.replace(/,/g, ',').replace('円', ' 円');
};

const InsuranceViewer = () => {
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await fetch('/api/policy?number=C531243530');
        const data = await response.json();
        setPolicy(data);
        setLoading(false);
      } catch (err) {
        setError('データの取得に失敗しました');
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <AlertCircle className="mr-2" /> {error}
      </div>
    );
  }

  if (!policy) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800">自動車保険証券</h1>
          <p className="text-gray-600">証券番号: {policy.policy_number}</p>
        </div>

        {/* 契約者情報 */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">契約者情報</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-gray-600 w-24">氏名:</span>
                  <span className="font-medium">{policy.insured_name}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-800">{policy.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-800">{policy.phone}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span>保険期間: {new Date(policy.coverage_start).toLocaleDateString()} ～ {new Date(policy.coverage_end).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  <span>支払方法: {policy.payment_method}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 車両情報 */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Car className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold">車両情報</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-gray-600 w-24">車種:</span>
                  <span className="font-medium">{policy.model}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-600 w-24">登録番号:</span>
                  <span className="font-medium">{policy.registration_number}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-600 w-24">製造年:</span>
                  <span className="font-medium">{policy.manufacture_year}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-start">
                {policy.collision_prevention_system && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    衝突被害軽減システム搭載
                  </span>
                )}
                {policy.hybrid_vehicle && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    ハイブリッド車
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 保険料と補償内容 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 保険料 */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">保険料</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">1年目:</span>
                    <span className="text-lg font-semibold">{formatCurrency(policy.year1_premium)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">2年目:</span>
                    <span className="text-lg font-semibold">{formatCurrency(policy.year2_premium)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">3年目:</span>
                    <span className="text-lg font-semibold">{formatCurrency(policy.year3_premium)}</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">適用割引</h3>
                  <div className="flex flex-wrap gap-2">
                    {policy.discounts?.map((discount: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {discount}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 補償内容 */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">補償内容</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">賠償責任</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">対人賠償:</div>
                    <div className="font-medium">{policy.personal_liability}</div>
                    <div className="text-gray-600">対物賠償:</div>
                    <div className="font-medium">{policy.property_liability}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">人身傷害</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">1名あたり限度額:</div>
                    <div className="font-medium">{policy.per_person_limit}</div>
                    <div className="text-gray-600">無保険車:</div>
                    <div className="font-medium">{policy.uninsured_motorist_limit}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">追加特約</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">レンタカー限度額:</div>
                    <div className="font-medium">{policy.rental_car_daily_limit}</div>
                    <div className="text-gray-600">ロードサービス:</div>
                    <div className="font-medium">{policy.roadside_assistance ? '有' : '無'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 緊急連絡先 */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">緊急連絡先</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-red-800 font-medium mb-2">事故受付</h3>
                <p className="text-lg font-bold text-red-700">{policy.accident_hotline}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-blue-800 font-medium mb-2">ロードサービス</h3>
                <p className="text-lg font-bold text-blue-700">{policy.roadside_service_hotline}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-green-800 font-medium mb-2">お客さまデスク</h3>
                <p className="text-lg font-bold text-green-700">{policy.customer_service_hotline}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsuranceViewer;