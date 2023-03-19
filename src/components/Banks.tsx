import { AnchorProvider, Program, utils, web3 } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { FC, useState } from 'react';
import idl from 'solanapdas.json';
import { Deposit } from './Deposit';
import { Withdraw } from './Withdraw';

const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
const programID = new PublicKey(idl.metadata.address)

export const Banks: FC = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [banks, setBanks] = useState([]);

    const getProvider = () => {
        const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
        return provider
    }

    const getBanks = async () => {
        try {
            console.log(programID.toString())
            const provider = getProvider()
            const program = new Program(idl_object, programID, provider)

            Promise.all((await connection.getProgramAccounts(programID)).map(async bank => ({
                ...(await program.account.bank.fetch(bank.pubkey))
            }))).then(banks => {
                console.log(banks)
                setBanks(banks)
            })
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
                    onClick={getBanks} disabled={!wallet.publicKey}
                >
                    <div className="hidden group-disabled:block">
                        Wallet not connected
                    </div>
                    <span className="block group-disabled:hidden" > 
                        List banks
                    </span>
                </button>


                {banks.map((bank) => {
                    return (
                        <div key={bank.pubkey}>
                            <h1>{bank.name.toString()}</h1>
                            <span>{bank.balance.toString()}</span>
                            <Deposit bankPublicKey={bank.pubkey} />
                            <Withdraw bankPublicKey={bank.pubkey}/>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
