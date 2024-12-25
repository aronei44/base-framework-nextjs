'use client';
import { Button, Input } from '@/components';
import { login } from '@/extras/security';
import { useState } from 'react';


export default function Login() {

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const SubmitLogin = async () => {
        const { data } = await login(form.email, form.password);
        if (data.success) {
            console.log(data)
        } else {
            alert(data.message);
        }
    }

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
                                setForm({
                                    ...form,
                                    email: e.target.value
                                })
                            }}
                            type='text'
                            value={form.email}
                            error={form.email === '' ? 'Email tidak boleh kosong' : ''}
                            required
                        />
                        <Input
                            label='Password'
                            name='password'
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    password: e.target.value
                                })
                            }}
                            type='password'
                            value={form.password}
                            error={form.password === '' ? 'Password tidak boleh kosong' : ''}
                            required
                        />
                        <Button
                            label='Login'
                            onClick={() => SubmitLogin()}
                            color='blue'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
