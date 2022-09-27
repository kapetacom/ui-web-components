import Peggy from 'peggy';

// @ts-ignore
import GRAMMAR from './grammar_datatypes.pegjs';

export const DataTypeParser = Peggy.generate(GRAMMAR);