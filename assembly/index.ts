// The entry file of your WebAssembly module.
import { JSON } from 'assemblyscript-json/assembly'


export * from './common'

export declare namespace console {
  //@ts-ignore valid in AS
  @external('sdk', 'log')
  function log(arg0: string): void
  //@ts-ignore valid in AS
  @external('sdk', 'logNumber')
  function logNumber(arg0: number): void
  //@ts-ignore valid in AS
  @external('sdk', 'logBool')
  function logBool(arg0: bool): void
  //@ts-ignore valid in AS
  @external('sdk', 'logUint8Array')
  function logUint8Array(arg0: Uint8Array): void
}

export declare namespace db {
  //@ts-ignore valid in AS
  @external('sdk', 'db.setObject')
  function setObject(key: string, val: string | null): void
  //@ts-ignore valid in AS
  @external('sdk', 'db.getObject')
  function getObject(key: string): string
}

export declare namespace SystemAPI {

  //@ts-ignore
  @external('sdk', 'system.getEnv')
  function getEnv(argv0: string): string
  // TODO this should also return null if `argv0` is not in the env

  //@ts-ignore
  @external('sdk', 'system.call')
  function call(name: string, params: string): string
}

export class ENV_DEFINITION {
  anchor_id: string = ""
  anchor_height: i64 = 0
  anchor_timestamp: i64 = 0
  anchor_block: string = ""
  msg_sender: string = ""
  msg_required_auths: Array<string> = []
  tx_origin: string = ""
  contract_id:string = ""
} 

export function getEnv(): ENV_DEFINITION {
  const str =  SystemAPI.getEnv('msg.required_auths');
  const arr = <JSON.Arr>JSON.parse(str)
  const fullArray = arr.valueOf()
  let itArray: Array<string> = []
  for(let i = 0; i < fullArray.length; i++) {
    const e = fullArray[i]
    if(e.isString) {
      itArray.push((<JSON.Str>e).valueOf())
    }
  }
  return {
    anchor_id: SystemAPI.getEnv('anchor.id'),
    anchor_height: I64.parseInt(SystemAPI.getEnv('anchor.height')),
    anchor_timestamp: I64.parseInt(SystemAPI.getEnv('anchor.timestamp')),
    anchor_block: SystemAPI.getEnv('anchor.block'),
    msg_sender: SystemAPI.getEnv('msg.sender'),
    msg_required_auths: itArray,
    tx_origin: SystemAPI.getEnv('tx.origin'),
    contract_id: SystemAPI.getEnv('contract_id')
  }
}



// export declare namespace CryptoBLS {
//   function verifySignature(msg: Uint8Array, signature: Uint8Array): boolean {

//     //This would be sufficient to get result
//     System.call('crypto.verifySignature', JSON.from({
//       type: 'ed25519',
//       msg,
//       signature
//     }).stringify())
//   }
// }


export class TxOutput { 
  json: JSON.Obj
  constructor() {
      this.json = new JSON.Obj()
  }

  /**
   * Optional debug msg
   * @param str 
   * 
   */
  msg(str: string): this {
      this.json.set('msg', str)
      return this;
  }

  /**
   * Exit code
   * Positive numbers to indicate different successful outcomes
   * Negative numbers to indicate different failed outcomes
   * @param code 
   * @returns {TxOutput}
   */
  exitCode(code: i32): this {
      this.json.set('code', code)
      return this;
  }

  /**
   * Response value. Must be serialized object. Can be completely arbitrary
   * @param ret 
   * @returns {TxOutput}
   */
  ret(ret: string): this {
    this.json.set('ret', ret)
    return this;
  }


  /**
   * Call when finished with output. 
   * string must be returned to the parent 
   * @returns {string}
   */
  done(): string {
      return this.json.stringify()
  }
}