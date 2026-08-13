import React, { useState, useEffect } from 'react';
import { UserProfile, Clan, ClanMember } from '../types';
import { 
  getClans, 
  saveClans, 
  createClan, 
  joinOrRequestClan, 
  acceptClanRequest, 
  rejectClanRequest, 
  kickClanMember, 
  leaveClan, 
  editClanDetails,
  addNotification 
} from '../utils/socialStorage';
import { subscribeToAllClans } from '../utils/firestoreService';
import { 
  Users, Shield, Trophy, Zap, Plus, LogOut, Swords, Sparkles, UserX, Settings, Check, X, Clock, AlertCircle, Edit3, Lock, Unlock
} from 'lucide-react';
import { translations } from '../utils/i18n';

interface ClansViewProps {
  user: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
  onClose?: () => void;
}

export const ClansView: React.FC<ClansViewProps> = ({ user, onUserUpdate, onClose }) => {
  const lang = user.language || 'pt';
  const t = translations[lang];

  const [clans, setClans] = useState<Clan[]>(getClans());

  useEffect(() => {
    const unsubscribe = subscribeToAllClans((firestoreClans) => {
      if (firestoreClans && firestoreClans.length > 0) {
        setClans(firestoreClans);
        saveClans(firestoreClans);
      }
    });
    return () => unsubscribe();
  }, []);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Form states
  const [clanName, setClanName] = useState('');
  const [clanTag, setClanTag] = useState('');
  const [clanDesc, setClanDesc] = useState('');
  const [clanAvatarUrl, setClanAvatarUrl] = useState('');
  const [clanJoinType, setClanJoinType] = useState<'open' | 'approval'>('open');
  const [activeBattleMessage, setActiveBattleMessage] = useState<string | null>(null);

  const myClan = clans.find(c => c.id === user.clanId || c.members.some(m => m.id === user.id));
  const isLeader = myClan?.leaderId === user.id;

  const refreshClans = () => {
    const updated = getClans();
    setClans(updated);
  };

  const openCreateClanModal = () => {
    setClanName('');
    setClanTag('');
    setClanDesc('');
    setClanAvatarUrl('');
    setClanJoinType('open');
    setFormError(null);
    setShowCreateModal(true);
  };

  const openEditClanModal = () => {
    if (!myClan) return;
    setClanName(myClan.name);
    setClanTag(myClan.tag);
    setClanDesc(myClan.description);
    setClanAvatarUrl(myClan.avatarUrl || '');
    setClanJoinType(myClan.joinType || 'open');
    setFormError(null);
    setShowEditModal(true);
  };

  const handleCreateClanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const res = createClan(user, {
      name: clanName,
      tag: clanTag,
      description: clanDesc,
      avatarUrl: clanAvatarUrl,
      joinType: clanJoinType,
    });

    if (!res.success) {
      setFormError(res.error || 'Erro ao criar clã.');
      return;
    }

    if (res.clan) {
      refreshClans();
      onUserUpdate({ ...user, clanId: res.clan.id });
      setShowCreateModal(false);
    }
  };

  const handleEditClanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myClan) return;
    setFormError(null);

    const res = editClanDetails(user, myClan.id, {
      name: clanName,
      tag: clanTag,
      description: clanDesc,
      avatarUrl: clanAvatarUrl,
      joinType: clanJoinType,
    });

    if (!res.success) {
      setFormError(res.error || 'Erro ao editar clã.');
      return;
    }

    setClans(res.clans);
    setShowEditModal(false);
  };

  const handleJoinOrRequest = (clan: Clan) => {
    const res = joinOrRequestClan(user, clan.id);
    if (res.message) {
      setActiveBattleMessage(res.message);
      setTimeout(() => setActiveBattleMessage(null), 4000);
    }

    if (res.success) {
      refreshClans();
      if (!res.isPending) {
        onUserUpdate({ ...user, clanId: clan.id });
      }
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    if (!myClan) return;
    const res = acceptClanRequest(user, myClan.id, requestId);
    if (res.success) {
      setClans(res.clans);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    if (!myClan) return;
    const res = rejectClanRequest(user, myClan.id, requestId);
    if (res.success) {
      setClans(res.clans);
    }
  };

  const handleKickMember = (memberId: string) => {
    if (!myClan) return;
    const res = kickClanMember(user, myClan.id, memberId);
    if (res.success) {
      setClans(res.clans);
    }
  };

  const confirmLeaveClan = () => {
    if (!myClan) return;
    const res = leaveClan(user, myClan.id);
    setClans(res.updatedClans);
    onUserUpdate(res.updatedUser);
    setShowLeaveConfirmModal(false);

    let msg = 'Você saiu do clã com sucesso.';
    if (res.isClanDeleted) {
      msg = 'Você saiu do clã. Como não restavam outros membros, o clã foi removido do banco de dados.';
    } else if (res.promotedLeaderName) {
      msg = `Você saiu do clã. A liderança foi transferida para ${res.promotedLeaderName}.`;
    }

    setActiveBattleMessage(msg);
    setTimeout(() => setActiveBattleMessage(null), 5000);
  };

  const handleClanVsClanBattle = (targetClan: Clan) => {
    if (!myClan) return;
    
    // Grant 2x XP booster and +1 Free Mock Exam Token
    const boosterEndTime = Date.now() + 24 * 3600 * 1000;
    const updatedUser: UserProfile = {
      ...user,
      doubleXpActiveUntil: boosterEndTime,
      mockExamsUsedThisMonth: Math.max(0, user.mockExamsUsedThisMonth - 1),
    };

    onUserUpdate(updatedUser);
    setActiveBattleMessage(`Sua equipe do Clã [${myClan.tag}] venceu a Batalha contra o Clã [${targetClan.tag}]! Bônus concedidos: 2x XP por 24h e +1 Token de Simulado!`);

    addNotification({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatarUrl,
      type: 'clan_invite',
      title: 'Batalha de Clãs Vencida!',
      message: `Seu clã [${myClan.tag}] derrotou o Clã [${targetClan.tag}]! Todos os membros ganharam Bônus de 2x XP!`,
    });
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 border border-teal-500/30 rounded-2xl p-5 shadow-xl text-white relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/30 inline-block mb-1">
              {t.clanMinMaxLimit}
            </span>
            <h2 className="text-2xl font-black text-white">{t.clansTitle}</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
              {t.clansDesc}
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-slate-950/40 flex items-center justify-center text-teal-400 border border-teal-500/30 shrink-0">
            <Users className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Battle Victory / Action Alert */}
      {activeBattleMessage && (
        <div className="bg-emerald-950/90 border border-emerald-500/60 p-4 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2.5 shadow-lg animate-fade-in">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
          <span>{activeBattleMessage}</span>
        </div>
      )}

      {/* MY CLAN DASHBOARD */}
      {myClan ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={myClan.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={myClan.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-extrabold text-white">{myClan.name}</h3>
                  <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                    [{myClan.tag}]
                  </span>
                  <span className="text-[9px] font-extrabold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {myClan.joinType === 'approval' ? 'Requer Aprovação' : 'Entrada Livre'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{myClan.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isLeader && (
                <button
                  onClick={openEditClanModal}
                  className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-teal-400 border border-slate-800 transition"
                  title="Editar Clã"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setShowLeaveConfirmModal(true)}
                className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-slate-800 transition"
                title={t.leaveClan}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clan Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                {lang === 'en' ? 'Total Clan XP' : 'XP Total do Clã'}
              </span>
              <span className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <Zap className="w-4 h-4 fill-emerald-400" /> {myClan.totalXp}
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                {lang === 'en' ? 'Clan Members' : 'Membros no Clã'}
              </span>
              <span className="text-lg font-black text-white flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-4 h-4 text-teal-400" /> {myClan.members.length} / 10
              </span>
            </div>
          </div>

          {/* PENDING JOIN REQUESTS (Leader Only) */}
          {isLeader && myClan.pendingRequests && myClan.pendingRequests.length > 0 && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 space-y-2.5">
              <h4 className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Join Requests' : 'Solicitações de Entrada'} ({myClan.pendingRequests.length})</span>
              </h4>

              <div className="space-y-2">
                {myClan.pendingRequests.map((req, idx) => (
                  <div key={`${req.id}-${idx}`} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={req.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={req.userName}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-white text-xs block truncate">{req.userName}</span>
                        {req.userUsername && (
                          <span className="text-[10px] font-mono text-teal-400 block font-bold">@{req.userUsername}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAcceptRequest(req.id)}
                        className="px-2.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-[11px] transition flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>{lang === 'en' ? 'Approve' : 'Aprovar'}</span>
                      </button>
                      <button
                        onClick={() => handleRejectRequest(req.id)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clan Members List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.clanMembers}</h4>
            <div className="space-y-1.5">
              {myClan.members.map((m, idx) => {
                const isMemberLeader = m.role === 'leader';
                const isSelf = m.id === user.id;

                return (
                  <div key={`${m.id}-${idx}`} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={m.name}
                        className="w-7 h-7 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-white truncate">{m.name} {isSelf ? (lang === 'en' ? '(You)' : '(Você)') : ''}</span>
                          {m.username && (
                            <span className="text-[10px] font-mono text-teal-400 font-bold">@{m.username}</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">{m.company || 'QA Engineer'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        isMemberLeader ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {isMemberLeader ? (lang === 'en' ? 'Leader' : 'Líder') : (lang === 'en' ? 'Member' : 'Membro')}
                      </span>

                      {/* Leader can kick non-leader members */}
                      {isLeader && !isMemberLeader && (
                        <button
                          onClick={() => handleKickMember(m.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                          title={lang === 'en' ? 'Remove from Clan' : 'Remover do Clã'}
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* JOIN OR CREATE CLAN PROMPT */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-center space-y-3">
          <Users className="w-10 h-10 text-teal-400 mx-auto" />
          <h3 className="text-base font-extrabold text-white">
            {lang === 'en' ? 'You are not in a Clan yet' : 'Você ainda não participa de nenhum Clã'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {lang === 'en'
              ? 'Join an existing clan to fight battles against other QA teams and earn bonus XP!'
              : 'Junte-se a um clã existente para disputar batalhas contra outros times de QA e ganhar bônus de XP!'}
          </p>
          <button
            onClick={openCreateClanModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 inline-flex items-center gap-1.5 transition hover:brightness-110"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t.createClan}</span>
          </button>
        </div>
      )}

      {/* LIST OF OTHER CLANS & BATTLES */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-extrabold text-white">
          {lang === 'en' ? 'Available QA Clans' : 'Clãs de QA Disponíveis'}
        </h3>

        <div className="space-y-3">
          {clans.map((c, idx) => {
            const isMyClan = myClan?.id === c.id;
            const isPending = c.pendingRequests?.some(r => r.userId === user.id);

            return (
              <div key={`${c.id}-${idx}`} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={c.avatarUrl} alt={c.name} className="w-10 h-10 rounded-xl object-cover border border-slate-800 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                      <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/30 shrink-0">
                        [{c.tag}]
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{c.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span>{lang === 'en' ? 'Members:' : 'Membros:'} {c.members.length}/10</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{c.totalXp} XP</span>
                      <span>•</span>
                      <span className="text-slate-400 font-semibold">
                        {c.joinType === 'approval' ? (lang === 'en' ? 'Approval' : 'Aprovação') : (lang === 'en' ? 'Open' : 'Livre')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {!user.clanId && (
                    isPending ? (
                      <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{lang === 'en' ? 'Pending' : 'Aguardando'}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleJoinOrRequest(c)}
                        className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs transition"
                      >
                        {c.joinType === 'approval' ? (lang === 'en' ? 'Request to Join' : 'Pedir p/ Entrar') : t.joinClan}
                      </button>
                    )
                  )}

                  {myClan && !isMyClan && (
                    <button
                      onClick={() => handleClanVsClanBattle(c)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-1 transition"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>{t.clanBattle}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE CLAN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white">{t.createClan}</h3>
            
            {formError && (
              <div className="bg-rose-950/80 border border-rose-500/60 p-3 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateClanSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">{t.clanName}</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bug Hunters Squad"
                  value={clanName}
                  onChange={e => setClanName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">{t.clanTag}</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  placeholder="Ex: BUG"
                  value={clanTag}
                  onChange={e => setClanTag(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">{t.clanDescription}</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Time de QA apaixonado por automação e simulados ISTQB."
                  value={clanDesc}
                  onChange={e => setClanDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Tipo de Entrada</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setClanJoinType('open')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      clanJoinType === 'open'
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Gratuito / Direto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClanJoinType('approval')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      clanJoinType === 'approval'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Por Aprovação</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition"
                >
                  Criar Clã
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CLAN MODAL (Leader Only) */}
      {showEditModal && myClan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white">Editar Clã</h3>
            
            {formError && (
              <div className="bg-rose-950/80 border border-rose-500/60 p-3 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEditClanSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nome do Clã</label>
                <input
                  type="text"
                  required
                  value={clanName}
                  onChange={e => setClanName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Tag (Abreviatura)</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={clanTag}
                  onChange={e => setClanTag(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={clanDesc}
                  onChange={e => setClanDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Tipo de Entrada</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setClanJoinType('open')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      clanJoinType === 'open'
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Gratuito / Direto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClanJoinType('approval')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      clanJoinType === 'approval'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Por Aprovação</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM LEAVE CLAN MODAL */}
      {showLeaveConfirmModal && myClan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white">Sair do Clã</h3>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              {isLeader ? (
                myClan.members.length > 1 ? (
                  <>
                    Você é o <strong className="text-amber-400">Líder</strong> deste clã. Ao sair, a liderança será transferida automaticamente para o próximo membro na sequência: <strong className="text-teal-400">{myClan.members.find(m => m.id !== user.id)?.name}</strong>.
                  </>
                ) : (
                  <>
                    Você é o único membro e <strong className="text-amber-400">Líder</strong> deste clã. Ao sair, o clã será <strong className="text-rose-400">excluído e limpo</strong> do banco de dados.
                  </>
                )
              ) : (
                'Tem certeza de que deseja sair deste clã?'
              )}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLeaveConfirmModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmLeaveClan}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition"
              >
                Confirmar Saída
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
