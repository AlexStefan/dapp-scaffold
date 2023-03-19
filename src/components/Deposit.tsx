import { AnchorProvider, BN, Program, web3 } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { FC, useState } from 'react';
import idl from 'solanapdas.json';

const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
const programID = new PublicKey(idl.metadata.address)

interface DepositProps {
    bankPublicKey: PublicKey;
}

export const Deposit: FC<DepositProps> = ({ bankPublicKey }: DepositProps) => {
    const wallet = useWallet();
    const { connection } = useConnection();

    const getProvider = () => {
        const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
        return provider
    }

    const depositToBank = async (bankPublicKey) => {
        try {
            const provider = getProvider()
            const program = new Program(idl_object, programID, provider)
            await program.rpc.deposit(new BN(0.1 * web3.LAMPORTS_PER_SOL), { accounts: {bank: bankPublicKey, user: provider.wallet.publicKey, systemProgram: web3.SystemProgram.programId}})
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex flex-row justify-center">
            <div className="relative group items-center">
                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <button
                    className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                    onClick={() => depositToBank(bankPublicKey)} disabled={!wallet.publicKey}
                >
                    <div className="hidden group-disabled:block">
                        Wallet not connected
                    </div>
                    <span className="block group-disabled:hidden" > 
                        Deposit 0.1 SOL to bank
                    </span>
                </button>
            </div>
        </div>
    );
};
