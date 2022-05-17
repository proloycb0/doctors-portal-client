import React, { useEffect, useState } from 'react';
import { useSendPasswordResetEmail, useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
import { useForm } from "react-hook-form";
import Loading from '../Shared/Loading/Loading';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useToken from '../../hooks/useToken';
import { toast } from 'react-toastify';

const Login = () => {
    const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
    const { register, formState: { errors }, handleSubmit, getValues } = useForm();
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);
    const [sendPasswordResetEmail, sending] = useSendPasswordResetEmail(auth);
    const [token] = useToken(user || gUser);
    // const [isEmail, setIsEmail] = useState('');

    let signInError;
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (token) {
            navigate(from, { replace: true });
        }
    }, [token, from, navigate]);

    if (loading || gLoading || sending) {
        return <Loading />;
    }
    if (error || gError) {
        signInError = <p className='text-red-500'><small>{error?.message} || {gError?.message}</small></p>
    }

    const onSubmit = async data => {
        console.log(data);
        await signInWithEmailAndPassword(data.email, data.password);
    }
    // const onChangeEmail = (e) => {
    //     const email = e.target.value;
    //     console.log(email)
    //     setIsEmail(email);
    // }
    const handleReset = async () => {
        const isEmail = getValues("email")
        console.log(isEmail)
        if (isEmail) {
            await sendPasswordResetEmail(isEmail);
            toast.success('Sent email')
        }
        else {
            toast.error('Please enter your email')
        }
    }

    return (
        <div className='flex h-screen justify-center items-center'>
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-center text-2xl font-bold">Login</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: 'Email is required'
                                    },
                                    pattern: {
                                        value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                                        message: 'Provide a valid email'
                                    }
                                })}
                                type="email"
                                name="email"
                                // onChange={onChangeEmail}
                                placeholder="Your email"
                                className="input input-bordered w-full max-w-xs"
                            />
                            <label className="label">
                                {errors.email?.type === 'required' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                                {errors.email?.type === 'pattern' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                            </label>
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="password"
                                className="input input-bordered w-full max-w-xs"
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: 'Password is required'
                                    },
                                    minLength: {
                                        value: 6,
                                        message: 'Must be 6 characters or more longer'
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.password?.type === 'required' && <span className="label-text-alt text-red-500">{errors.password.message}</span>}
                                {errors.password?.type === 'minLength' && <span className="label-text-alt text-red-500">{errors.password.message}</span>}
                            </label>
                        </div>
                        <p><small>Forgot Password? <button onClick={handleReset} className='text-primary'>Reset Password</button></small></p>
                        {signInError}
                        <input className='btn w-full max-w-xs mt-1' type="submit" value="Login" />
                    </form>
                    <p><small>New to Doctors Portal? <Link className='text-secondary' to="/signup">Create New Account</Link></small></p>
                    <div className="divider">OR</div>
                    <button onClick={() => signInWithGoogle()} className="btn btn-outline uppercase">Continue with Google</button>
                </div>
            </div>
        </div>
    );
};

export default Login;