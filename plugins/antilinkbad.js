const fs=require('fs');const path=require('path');const{readEnv}=require('../lib/database');const{cmd,commands}=require('../command');const{fetchJson}=require('../lib/functions');let userWarnings={};cmd({on:"body"},async(conn,mek,m,{from,body,isCmd,isGroup,isOwner,isAdmins,groupAdmins,isBotAdmins,sender,pushname,groupName,quoted})=>{try{const config=await readEnv();const botOwner=config.OWNER_NUMBER;const maxWarnings=config.WARN_COUNT||10;if(!userWarnings[sender]){userWarnings[sender]=0;}const sendAlertToOwner=async(triggerType,groupName,sender,message,action)=>{const alertMessage=`🚨 ${triggerType} triggered in ${groupName}\nSender: @${sender.split('@')[0]}\nMessage: ${message}\nAction: ${action}`;await conn.sendMessage(botOwner,{text:alertMessage,mentions:[sender]});};const handleWarnings=async(type,maxWarnings)=>{userWarnings[sender]+=1;let action='warn';if(userWarnings[sender]>=maxWarnings){await conn.sendMessage(from,{text:`𝗕𝗬𝗘 ~*@${sender.split('@')[0]}*~`,mentions:[sender]});await conn.groupParticipantsUpdate(from,[sender],'remove');action='kick';userWarnings[sender]=0;const kickMessage=`𝗛𝗲𝘆 @${sender.split('@')[0]},\n𝗬𝗼𝘂𝗿 𝗞𝗜𝗖𝗞𝗘𝗗 𝗳𝗿𝗼𝗺 *${groupName}* 𝗴𝗿𝗼𝘂𝗽.\n𝗥𝗲𝗮𝘀𝗼𝗻: ${body}`;await conn.sendMessage(sender,{text:kickMessage,mentions:[sender]});}else{const remainingWarnings=maxWarnings-userWarnings[sender];const warnCountMessage=`👺 ~*@${sender.split('@')[0]}*~\n*⚠️ ${type.toUpperCase()} DELETED: ‼️*\n🚫 *𝗪𝗔𝗥𝗡 𝗖𝗢𝗨𝗡𝗧 : ${remainingWarnings}/${maxWarnings}*`;await conn.sendMessage(from,{text:warnCountMessage,mentions:[sender]});}await sendAlertToOwner(type.toUpperCase(),groupName,sender,body,action);};if(config.ANTI_BAD==='delete'||config.ANTI_BAD==='warn'||config.ANTI_BAD==='kick'){const badWordsBlacklist=["fuc","huk","hut","ponn","pinn","paca","හුක","හුත්","අම්ම","අබිසාරි","Wutt","Wuka","වේසි","wesi","vesi","පුක","puk","කිම්බ","ammata","කැරි","pak","අවජාත","awaja","avaja","ammata","ponyo","පක","pky","පොන්න","පග","kari","Htto","Hkpn","Utto","න්නයා","වජාතයා","වේස","නගින්නෑ"];const containsBadWord=badWordsBlacklist.some(word=>body.toLowerCase().includes(word));if(containsBadWord){if(isGroup){if(isBotAdmins){const senderIsAdmin=groupAdmins.includes(sender);if(!senderIsAdmin&&!isOwner){const key={remoteJid:from,fromMe:false,id:mek.key.id,participant:sender};await conn.sendMessage(from,{delete:key});if(config.ANTI_BAD==='warn'){await handleWarnings("BAD WORD",maxWarnings);}else if(config.ANTI_BAD==='kick'){await conn.sendMessage(from,{text:`👺 ~*@${sender.split('@')[0]}*~\n*⚠️ BAD WORD DELETED: ‼️*\n🚫 *𝗞𝗜𝗖𝗞 𝗦𝗘𝗡𝗗𝗘𝗥*`,mentions:[sender]});await conn.groupParticipantsUpdate(from,[sender],'remove');await sendAlertToOwner("Bad word",groupName,sender,body,"kick");const kickMessage=`𝗛𝗲𝘆 @${sender.split('@')[0]},\n𝗬𝗼𝘂𝗿 𝗞𝗜𝗖𝗞𝗘𝗗 𝗳𝗿𝗼𝗺 *${groupName}* 𝗴𝗿𝗼𝘂𝗽.\n𝗥𝗲𝗮𝘀𝗼𝗻: ${body}`;await conn.sendMessage(sender,{text:kickMessage,mentions:[sender]});}else{await conn.sendMessage(from,{text:`👺 ~*@${sender.split('@')[0]}*~\n*⚠️ BAD WORD DELETED: ‼️*`,mentions:[sender]});await sendAlertToOwner("Bad word",groupName,sender,body,"delete");}}}else{const adminsMention=groupAdmins.map(admin=>`@${admin.split('@')[0]}`).join(' ');const botNotAdminMessage=`⚠️ DilaMD bot does not have admin privileges, but bad words were detected.`;await conn.sendMessage(from,{text:botNotAdminMessage,mentions:groupAdmins});}}}}if(config.ANTI_LINK==='delete'||config.ANTI_LINK==='warn'||config.ANTI_LINK==='kick'){const linksBlacklist=["wa.me","chat.whatsapp.com","whatsapp.com","www.tiktok.com/@","youtube.com/@","whatspp.gruop"];const containsBlacklistedLink=linksBlacklist.some(word=>body.toLowerCase().includes(word));if(containsBlacklistedLink){if(isGroup){if(isBotAdmins){const senderIsAdmin=groupAdmins.includes(sender);if(!senderIsAdmin&&!isOwner){const key={remoteJid:from,fromMe:false,id:mek.key.id,participant:sender};await conn.sendMessage(from,{delete:key});if(config.ANTI_LINK==='warn'){await handleWarnings("LINK",maxWarnings);}else if(config.ANTI_LINK==='kick'){await conn.sendMessage(from,{document:{url:'https://drive.google.com/uc?export=download&id=1YYPnkKWdrxFe8C2kWdwf8qkeE0PO5RjW'},mimetype:'audio/mp3',fileName:'song.mp3',caption:`👺 ~*@${sender.split('@')[0]}*~\n*⚠️ BAD LINK DELETED: ‼️*`,mentions:[sender]});await conn.groupParticipantsUpdate(from,[sender],'remove');await sendAlertToOwner("Antilink",groupName,sender,body,"kick");const kickMessage=`𝗛𝗲𝘆 @${sender.split('@')[0]},\n𝗬𝗼𝘂𝗿 𝗞𝗜𝗖𝗞𝗘𝗗 𝗳𝗿𝗼𝗺 *${groupName}* 𝗴𝗿𝗼𝘂𝗽.\n𝗥𝗲𝗮𝘀𝗼𝗻: ${body}`;await conn.sendMessage(sender,{text:kickMessage,mentions:[sender]});}else{await conn.sendMessage(from,{document:{url:'https://drive.google.com/uc?export=download&id=1YYPnkKWdrxFe8C2kWdwf8qkeE0PO5RjW'},mimetype:'audio/mp3',fileName:'song.mp3',caption:`👺 ~*@${sender.split('@')[0]}*~\n*⚠️ BAD LINK DELETED: ‼️*`,mentions:[sender]});await sendAlertToOwner("Antilink",groupName,sender,body,"delete");}}}else{const adminsMention=groupAdmins.map(admin=>`@${admin.split('@')[0]}`).join(' ');const botNotAdminMessage=`⚠️ DilaMD bot does not have admin privileges, but a link was detected.`;await conn.sendMessage(from,{text:botNotAdminMessage,mentions:groupAdmins});}}}}}catch(e){console.error(`Error in auto-delete functionality: ${e.message}`);const botOwner=config.OWNER_NUMBER;await conn.sendMessage(botOwner,{text:`⚠️ Error occurred in auto-delete functionality: ${e.message}`});}});
