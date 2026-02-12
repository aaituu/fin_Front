import React from 'react';
import { api } from '../services/api';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [status, setStatus] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await api.contact.submit({ name, phone, email, message });
      setStatus({ ok: true, text: 'Your request has been sent. We will contact you soon.' });
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setStatus({ ok: false, text: err?.message || 'Failed to send request' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left panel */}
          <div className="rounded-2xl bg-indigo-700 text-white p-10 shadow-sm">
            <h1 className="text-4xl font-extrabold tracking-tight">Свяжитесь с нами</h1>
            <p className="mt-4 text-indigo-100">
              Остались вопросы? Оставьте заявку и наши менеджеры свяжутся с вами в ближайшее время для консультации.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-indigo-200">Телефон</div>
                  <div className="text-lg font-semibold">+7 (777) 777 7777</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-indigo-200">Email</div>
                  <div className="text-lg font-semibold">aitu@aitu.com</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-indigo-200">Адрес</div>
                  <div className="text-lg font-semibold">Мангылык ел, С1</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="rounded-2xl bg-white p-10 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Быстрая заявка</h2>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ваше имя (не обязательно)
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Александр"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Телефон</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="you@mail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Сообщение</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 w-full min-h-[140px] rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Коротко опишите запрос..."
                  required
                />
              </div>

              {status && (
                <div className={status.ok ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
                  {status.text}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 text-white font-semibold py-3 shadow-md hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? 'Отправка...' : 'ОТПРАВИТЬ ЗАЯВКУ'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
