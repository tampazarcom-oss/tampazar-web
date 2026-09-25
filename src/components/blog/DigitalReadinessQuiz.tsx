import React, { useState } from 'react';
import { HelpCircle, Check, Award, ArrowRight, RefreshCw, Store, Sparkles } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: { text: string; points: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Google Haritalar'da dükkanınız kayıtlı mı ve bilgileri güncel mi?",
    options: [
      { text: "Evet, her şey güncel ve yorumları yanıtlıyorum", points: 25 },
      { text: "Kayıtlı ama bilgiler eski ya da kontrol bende değil", points: 15 },
      { text: "Hayır, henüz eklemedim", points: 5 }
    ]
  },
  {
    id: 2,
    text: "Müşterilerinizden online/kredi kartı ödemesi alıyor musunuz?",
    options: [
      { text: "Evet, kendi Sanal POS'um / komisyonsuz kanallarım var", points: 25 },
      { text: "Evet ama yüksek komisyon (%15+) alan platformlar üzerinden", points: 15 },
      { text: "Sadece fiziksel dükkanda nakit veya POS cihazı kullanıyorum", points: 5 }
    ]
  },
  {
    id: 3,
    text: "Geleneksel veresiye defterini veya alacak takiplerinizi nasıl yapıyorsunuz?",
    options: [
      { text: "Dijital veresiye/muhasebe yazılımları ile anlık takip ediyorum", points: 25 },
      { text: "Kağıt defter kullanıyorum ama kaybolmasından korkuyorum", points: 15 },
      { text: "Veresiye vermiyorum ya da aklımda tutuyorum", points: 10 }
    ]
  },
  {
    id: 4,
    text: "Müşterilerinize e-Fatura veya e-Arşiv faturası kesiyor musunuz?",
    options: [
      { text: "Evet, otomatik entegrasyonla saniyeler içinde kesiyorum", points: 25 },
      { text: "Evet ama pahalı muhasebeci portalları üzerinden manuel giriyorum", points: 15 },
      { text: "Yalnızca kağıt fiş kesiyorum", points: 5 }
    ]
  }
];

export const DigitalReadinessQuiz: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const handleSelectOption = (points: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIdx]: points }));
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);

  const getResult = (score: number) => {
    if (score >= 85) {
      return {
        title: "Süper Dijital Esnaf! 🚀",
        badge: "DİJİTAL LİDER",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        desc: "Dükkanınız dijital çağa tamamen ayak uydurmuş durumda. TamPazar'ın %0 komisyonlu Sanal POS entegrasyonu ve ücretsiz GİB e-fatura sistemini bağlayarak kâr marjınızı daha da yukarılara çekebilirsiniz!"
      };
    } else if (score >= 50) {
      return {
        title: "Gelişmekte Olan Esnaf 📈",
        badge: "DİJİTAL ÇIRAK",
        color: "text-amber-700 bg-amber-50 border-amber-200",
        desc: "Dijitalleşmeye başlamışsınız ancak yüksek komisyonlu platformlar veya manuel süreçler kârınızı eritiyor. TamPazar ile kendi dükkan adınızı taşıyan komisyonsuz sipariş sitenizi 2 dakikada ücretsiz açabilirsiniz."
      };
    } else {
      return {
        title: "Geleneksel Usta 🛠️",
        badge: "GELENEKSEL ESNAF",
        color: "text-red-700 bg-red-50 border-red-200",
        desc: "İşlerinizde tamamen geleneksel yöntemleri tercih ediyorsunuz. Bu durum yeni nesil müşterileri kaçırmanıza yol açabilir. TamPazar'ın ücretsiz dijitalleşme eğitimleri ve QR menü desteğiyle ilk adımı bugün atın!"
      };
    }
  };

  const result = getResult(totalScore);

  const handleRestart = () => {
    setCurrentQuestionIdx(0);
    setAnswers({});
    setQuizFinished(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Dükkan Dijitalleşme Testi</h2>
            <p className="text-xs text-slate-500">İşletmenizin dijital karnesini 1 dakikada çıkarın ve tavsiyeler alın.</p>
          </div>
        </div>
        <span className="text-xs font-black bg-purple-100 text-purple-900 px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 fill-purple-500" /> Esnaf Analiz
        </span>
      </div>

      {!quizFinished ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Soru {currentQuestionIdx + 1} / {QUESTIONS.length}</span>
              <span>%{( (currentQuestionIdx + 1) / QUESTIONS.length * 100 ).toFixed(0)} Tamamlandı</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
              {QUESTIONS[currentQuestionIdx].text}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {QUESTIONS[currentQuestionIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.points)}
                  className="w-full p-4 text-left bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl font-semibold text-xs sm:text-sm text-slate-700 hover:text-emerald-950 transition cursor-pointer flex items-center justify-between group"
                >
                  <span>{opt.text}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 group-hover:translate-x-1 transition" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quiz Result Panel */}
          <div className={`p-6 rounded-3xl border ${result.color} space-y-4`}>
            <div className="flex items-center justify-between border-b border-current/20 pb-3">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-slate-900 text-white uppercase tracking-wider">
                {result.badge}
              </span>
              <span className="text-xs font-black">Toplam Puan: {totalScore} / 100</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black">{result.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed font-medium">
                {result.desc}
              </p>
            </div>
          </div>

          {/* TamPazar Action Plan Card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2.5 bg-slate-800 rounded-xl">👨‍💼</span>
              <div>
                <p className="text-xs font-black text-white">Adım Atmaya Hazır mısınız?</p>
                <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                  Dükkanınızı ücretsiz dijitalleştirin ve %0 komisyonla doğrudan satmaya başlayın.
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/yonetim'}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition"
            >
              <Store className="w-4 h-4" /> Dükkanı Aç & Dijitalleş
            </button>
          </div>

          <button
            onClick={handleRestart}
            className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <RefreshCw className="w-4 h-4" /> Testi Yeniden Çöz
          </button>
        </div>
      )}
    </div>
  );
};
