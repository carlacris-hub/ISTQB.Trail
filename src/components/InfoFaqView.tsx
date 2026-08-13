import React, { useState } from 'react';
import { 
  HelpCircle, Download, ExternalLink, ShieldCheck, DollarSign, Calendar, Award, 
  BookOpen, ChevronDown, ChevronUp, CheckCircle2, Sparkles, Globe, FileText, AlertCircle
} from 'lucide-react';
import { translations, Language } from '../utils/i18n';

interface InfoFaqViewProps {
  language?: Language;
  onOpenAuth?: () => void;
  onOpenPremium?: () => void;
}

export const InfoFaqView: React.FC<InfoFaqViewProps> = ({
  language = 'pt',
  onOpenAuth,
  onOpenPremium
}) => {
  const t = translations[language];
  const [openSection, setOpenSection] = useState<string | null>('syllabus');

  const toggleSection = (id: string) => {
    setOpenSection(prev => prev === id ? null : id);
  };

  const officialSyllabusUrl = 'https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/';

  return (
    <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto space-y-6 text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/50 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <Globe className="w-3.5 h-3.5" /> {t.infoFaqTitle}
            </div>
            <h2 className="text-xl font-black text-white">
              {t.officialSyllabus}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-md leading-relaxed">
              {t.infoFaqDesc}
            </p>
          </div>

          <a
            href={officialSyllabusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition shrink-0"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t.officialPortal}</span>
          </a>
        </div>
      </div>

      {/* Official Syllabus Download Card */}
      <div className="bg-slate-900 border border-teal-500/40 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Syllabus ISTQB CTFL v4.0.1 (PDF)</h3>
              <p className="text-xs text-slate-400">
                {language === 'en' ? 'Official complete document issued by ISTQB International' : 'Documento oficial completo emitido pelo ISTQB International'}
              </p>
            </div>
          </div>

          <a
            href={officialSyllabusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold text-xs hover:bg-teal-500/20 transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>{t.downloadPdf}</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">{language === 'en' ? 'Questions' : 'Questões'}</span>
            <span className="font-bold text-white">{t.examQuestionsCount}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">{language === 'en' ? 'Duration' : 'Tempo de Prova'}</span>
            <span className="font-bold text-white">{t.examTimeLimit}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">{language === 'en' ? 'Pass Mark' : 'Nota de Corte'}</span>
            <span className="font-bold text-emerald-400">{t.passingScore}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-semibold">{language === 'en' ? 'Validity' : 'Validade'}</span>
            <span className="font-bold text-teal-300">{t.validityLifetime}</span>
          </div>
        </div>
      </div>

      {/* Accordion List: Exam Guide & FAQ */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          {t.faqHeader}
        </h3>

        {/* Item 1: Valores e Onde Marcar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <button
            onClick={() => toggleSection('values')}
            className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-white hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-2.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>{t.faqQuestion1}</span>
            </div>
            {openSection === 'values' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'values' && (
            <div className="p-4 pt-0 text-xs text-slate-300 space-y-3 border-t border-slate-800/50">
              <p className="leading-relaxed">
                {language === 'en'
                  ? 'Exam fees depend on the chosen Exam Board and local currency:'
                  : 'O valor do exame varia conforme o órgão certificador (Exam Board) escolhido e a moeda local:'}
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong className="text-white">BSTQB (Brazil):</strong> ~R$ 1.100 to R$ 1.350 BRL (Portuguese exam).</li>
                <li><strong className="text-white">iSQI / Pearson VUE / Brightest / GASQ:</strong> $200 to $250 USD / €210 EUR.</li>
              </ul>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-teal-400 block">{language === 'en' ? 'Where to schedule:' : 'Onde Agendar:'}</span>
                <div className="flex flex-wrap gap-2">
                  <a href="https://bstqb.org.br" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-teal-300 text-[11px] font-semibold border border-slate-700">
                    BSTQB <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://home.pearsonvue.com/isqi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-teal-300 text-[11px] font-semibold border border-slate-700">
                    Pearson VUE Centers <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://isqi.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-teal-300 text-[11px] font-semibold border border-slate-700">
                    iSQI Online <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Item 2: Regras do Exame Oficial */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <button
            onClick={() => toggleSection('rules')}
            className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-white hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>{t.faqQuestion2}</span>
            </div>
            {openSection === 'rules' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'rules' && (
            <div className="p-4 pt-0 text-xs text-slate-300 space-y-2 border-t border-slate-800/50">
              <p className="leading-relaxed">
                {language === 'en'
                  ? 'The CTFL v4.0.1 exam is a closed-book multiple-choice test:'
                  : 'O exame CTFL v4.0.1 é uma prova de múltipla escolha rigorosa sem consulta:'}
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong className="text-white">{language === 'en' ? '40 Questions:' : '40 Questões:'}</strong> {language === 'en' ? 'Proportionally distributed across the 6 syllabus chapters.' : 'Distribuídas proporcionalmente entre os 6 capítulos do syllabus.'}</li>
                <li><strong className="text-white">{language === 'en' ? '65% Pass Score (26 points):' : '65% de Acertos (26 pontos):'}</strong> {language === 'en' ? 'Minimum needed to pass.' : 'Mínimo necessário para aprovação.'}</li>
                <li><strong className="text-white">{language === 'en' ? '60-minute limit:' : 'Duração de 60 minutos:'}</strong> {language === 'en' ? 'Non-native language candidates receive 15 extra minutes (75 mins total).' : 'Candidatos fazendo o exame em idioma não nativo têm direito a 15 minutos extras (+25% de tempo = 75 min).'}</li>
                <li><strong className="text-white">{language === 'en' ? 'No negative marking:' : 'Sem penalidade por erro:'}</strong> {language === 'en' ? 'No points are deducted for wrong answers.' : 'Não há desconto de pontos para respostas incorretas.'}</li>
              </ul>
            </div>
          )}
        </div>

        {/* Item 3: Como funciona a aprovação de capítulos no aplicativo (A regra dos 70%) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <button
            onClick={() => toggleSection('appRules')}
            className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-white hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{t.faqQuestion3}</span>
            </div>
            {openSection === 'appRules' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'appRules' && (
            <div className="p-4 pt-0 text-xs text-slate-300 space-y-2 border-t border-slate-800/50">
              <p className="leading-relaxed">
                {language === 'en'
                  ? 'To guarantee official readiness, our app applies the '
                  : 'Para garantir a sua preparação no padrão da prova oficial, nosso aplicativo aplica a '}
                <strong className="text-amber-300">{language === 'en' ? '70% Passing Rule' : 'Regra de Aprovação de 70%'}</strong>:
              </p>
              <p className="leading-relaxed bg-amber-950/40 p-3 rounded-xl border border-amber-800/50 text-amber-200">
                {language === 'en'
                  ? 'If you score below 70% on a chapter quiz, the next chapter will remain locked until you retake the quiz and score at least 70%.'
                  : 'Se você errar mais de 30% das questões no quiz de um capítulo (taxa de acerto inferior a 70%), o próximo capítulo permanecerá bloqueado até que você refaça o quiz e obtenha pelo menos 70% de acertos.'}
              </p>
            </div>
          )}
        </div>

        {/* Item 4: Limites da Conta Convidado (Guest) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <button
            onClick={() => toggleSection('guestLimit')}
            className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-white hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{t.faqQuestion4}</span>
            </div>
            {openSection === 'guestLimit' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'guestLimit' && (
            <div className="p-4 pt-0 text-xs text-slate-300 space-y-2 border-t border-slate-800/50">
              <p className="leading-relaxed">
                {language === 'en'
                  ? 'As a guest, you can explore the interface and read all 15 micro-lessons of Chapter 1.'
                  : 'Como Convidado, você pode explorar a interface e ler todas as 15 micro-lições do Capítulo 1.'}
              </p>
              <p className="leading-relaxed">
                {language === 'en'
                  ? 'To take quizzes, save progress to the cloud, unlock Chapters 2 to 6, and take Mock Exams, simply create a free account with email or Google.'
                  : 'Para realizar os quizzes, salvar seu progresso na nuvem, desbloquear os Capítulos 2 a 6 e realizar o Simulado do Exame, basta criar uma conta gratuita com seu e-mail ou conta Google.'}
              </p>
              {onOpenAuth && (
                <button
                  onClick={onOpenAuth}
                  className="mt-2 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs transition"
                >
                  {t.createNewAccount}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Item 5: Sistema de Vidas, Streak e Plano Premium */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <button
            onClick={() => toggleSection('lives')}
            className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-white hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>{t.faqQuestion5}</span>
            </div>
            {openSection === 'lives' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'lives' && (
            <div className="p-4 pt-0 text-xs text-slate-300 space-y-2 border-t border-slate-800/50">
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong className="text-white">{language === 'en' ? 'Lives (5/5):' : 'Vidas (5/5):'}</strong> {language === 'en' ? 'Each incorrect quiz answer deducts 1 life. They recharge automatically every 4 hours or by watching a rewarded ad.' : 'Cada resposta incorreta nos quizzes deduz 1 vida. Elas recarregam automaticamente a cada 4 horas ou assistindo a um vídeo patrocinado.'}</li>
                <li><strong className="text-white">{t.freeReview}:</strong> {language === 'en' ? 'Practice questions without spending lives.' : 'Permite praticar questões sem gastar vidas.'}</li>
                <li><strong className="text-white">{t.proPlan}:</strong> {language === 'en' ? 'Grants infinite lives (∞), unlimited mock exams, and double XP boosts.' : 'Concede vidas infinitas (∞), simulados ilimitados e bônus de XP em dobro.'}</li>
              </ul>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
