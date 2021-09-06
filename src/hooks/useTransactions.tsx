import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api } from '../services/api';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>; // Toda ves que a funçã for assincrona, retorna uma promise, por isso coloco o retorno dentro de uma
}

//Para a criação de transaction posso usar assim
// interface TransactionInput {
//   title: string;
//   amount: number;
//   type: string;
//   category: string;
// }

// Ou uso essa sitaxe, que herda todas as propriedades de Transaction menos id e createAt
// ele omite o id e o createAt
type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

// Ou uso o Pick, que é o contráario, ele seleciona só os campos que le quer
// type transactionsInput = Pick<
//   transactions,
//   'title' | 'amount' | 'type' | 'category'
// >;

const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export function TransacitonsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api
      .get('transactions')
      .then((response) => setTransactions(response.data.transactions));
  }, []);

  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post('/transactions', {
      ...transactionInput,
      createdAt: new Date(),
    });
    const { transaction } = response.data;

    setTransactions([...transactions, transaction]);
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}
