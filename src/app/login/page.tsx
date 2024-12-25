'use client';
import { Button, Input } from '@/components';
import { useAuth } from '@/extras/authcontext';


export default function Login() {
    const auth = useAuth();
    const { state, action } = auth;
    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-1/2 bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center">Selamat Datang</h1>
                <h3 className="text-center text-gray-500">Silakan login untuk melanjutkan</h3>
                <hr className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        {/* logo here */}
                    </div>
                    <div>
                        <Input
                            label='Email'
                            name='email'
                            onChange={(e) => {
                                action.setForm({
                                    ...state.form,
                                    email: e.target.value
                                })
                            }}
                            type='text'
                            value={state.form.email}
                            error={state.form.email === '' ? 'Email tidak boleh kosong' : ''}
                            required
                        />
                        <Input
                            label='Password'
                            name='password'
                            onChange={(e) => {
                                action.setForm({
                                    ...state.form,
                                    password: e.target.value
                                })
                            }}
                            type='password'
                            value={state.form.password}
                            error={state.form.password === '' ? 'Password tidak boleh kosong' : ''}
                            required
                        />
                        <Button
                            label='Login'
                            onClick={() => action.Login(state.form)}
                            color='blue'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
