import { AnchorProvider, BN, Program, web3 } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { FC } from 'react';
import idl from 'solanapdas.json';

const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
const programID = new PublicKey(idl.metadata.address)

interface WithdrawProps {
    bankPublicKey: PublicKey;
}

export const Withdraw: FC<WithdrawProps> = ({ bankPublicKey }) => {
    const wallet = useWallet();
    const { connection } = useConnection();

    const getProvider = () => {
        const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
        return provider
    }

    const withdrawFromBank = async (bankPublicKey) => {
        try {
            const provider = getProvider()
            const program = new Program(idl_object, programID, provider)
            await program.rpc.withdraw(new BN(0.1 * web3.LAMPORTS_PER_SOL), { accounts: {bank: bankPublicKey, user: provider.wallet.publicKey}})
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
                    onClick={() => withdrawFromBank(bankPublicKey)} disabled={!wallet.publicKey}
                >
                    <div className="hidden group-disabled:block">
                        Wallet not connected
                    </div>
                    <span className="block group-disabled:hidden" > 
                        Withdraw 0.1 SOL from bank
                    </span>
                </button>
            </div>
        </div>
    );
};
