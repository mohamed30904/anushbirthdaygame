// ============================================================
//  EDIT THIS FILE to personalize the game — no coding needed.
// ============================================================

// ------------------------------------------------------------
// ANUSHOS — the boot cutscene + fake desktop you see before the 3D game
// starts. Everything here is just text/content — add your own notes,
// letters, photos, and folders freely, no coding needed.
//
// Every desktop/dock icon (and every "folder" icon's children) is one of:
//   { type: "note",   label, icon, content }         — opens a text window
//   { type: "image",  label, icon, src }              — opens an image window
//   { type: "folder", label, icon, children: [...] }  — opens a window full
//                                                        of more icons
//   { type: "app",    label, icon, action: "start-game" } — closes AnushOS
//                                                            and reveals the
//                                                            game's Start
//                                                            screen (only
//                                                            "start-game" is
//                                                            wired up)
// `icon` is just an emoji — swap any of these for whatever you like.
// ------------------------------------------------------------
export const OS_CONFIG = {
  userName: "Anush",

  // Login screen shown right after the boot progress bar finishes, before
  // the desktop appears. Edit username/password here — plain text, no
  // real security (this is just for fun, not an actual account system).
  login: {
    username: "anushunanyan",
    password: "13JULY2004",
    avatar: "🌷", // fallback if avatarImage is ever removed
    avatarImage: "images/AnushOSProfilePic.jpg",
    greeting: "Welcome back",
    wrongPasswordMessage: "Incorrect username or password — try again.",
  },

  desktopIcons: [
    {
      id: "my-computer",
      type: "folder",
      label: "My Computer",
      icon: "🖥️",
      children: [
        {
          id: "local-disk",
          type: "folder",
          label: "Local Disk (C:)",
          icon: "💾",
          children: [],
        },
      ],
    },
    {
      id: "recycle-bin",
      type: "folder",
      label: "Recycle Bin",
      icon: "🗑️",
      children: [
        {
          id: "search-history-note",
          type: "note",
          label: "search_history.txt",
          icon: "📝",
          content:
            "Feet, Sucking white toes, How to kill Mohammed Sayed, How do I tell Mohammed Sayed that I hate him, How can I cope with being the prettiest most gorgeous in the world",
        },
        {
          id: "times-u-almost-cut-me-off-note",
          type: "note",
          label: "times_u_almost_cut_me_off.txt",
          icon: "📝",
          content: "",
        },
      ],
    },
    {
      id: "notes-folder",
      type: "folder",
      label: "Letters",
      icon: "💌",
      children: [
        {
          id: "note-1apr",
          type: "note",
          label: "1APRIL2026.txt",
          icon: "📝",
          content: `1st of April - 2026

So,
I don't know why I am doing this. I told you that I won't text you and I will honor that. I have also been told and read so many times that writing helps. But I get this insane urge to text you to tell you how much I regret that I made you feel this way. I wish you could've made sense of my brain and saw that this wasn't me lying, but I cannot blame you
I was just looking through our chats in June last year. This was so fun, you know. I really miss this time. We had no worries nor concerns. I get that this is my doing, but I wish you didn't see me through this lens and think this is who I am.
You said before a lot of times that if the situations were reversed, I would do the same, or I wouldn't be as forgiving. You were very wrong. I would've. But I don't expect you to do the same. I cannot escape your scent, your face, and your smile.
Today has been the same, I am still going the terrible route of coping. I am damaging myself and I know it is wrong. But I cannot help to destruct the self that you had to get away from. I am doing all the things I promised myself not to do. I am drinking, smoking, and giving up everything that I worked for. I think I will get back on the right path, I will probably go back to work, go see my family, talk to my friends, but I cannot get this gut wrecking feeling out of me.
I know you care about the past, and those situations have to be explained if we ever end up talking again. I wish I could make you understand how I lived and still live my life, really erratic. I never communicated, I have never shared my details with people, and this is where I went wrong. I should've been more conscious and aware about it. I am not expecting you to believe me. Hell, I don't even know if you will read this ever. But this makes me feel closer to you. I have your polaroid next to my screen and I am wishing it speaks back to me. I am wishing it hugs me tight and sees me as the one who adores the ground she walks on. I really thought we would go so far this would be something we look back at and think how were we gonna leave each other over this.
I talked to Leo today. I didn't tell him we broke up but I think he can guess it. He told me that I have to find myself again, to reprogram my brain to be happy and to be excited about things. The thing is, I don't wanna find myself if that self is a stranger to you. I know this is the same broken record that you already heard, but I cannot stop that record without my best friend here to console me. You took my love, my best friend, my role model, and one of my biggest motives, and still I cannot hate you. I cannot resent you.
When I saw you in the library, I wanted to cry way more. I wanted to beg you so much to not do this. I didn't want you to let me go from your arms. You were so beautiful, and I was so hurt to not be able to hold your hands or hug you longer. With you, I make you live a tiring life, and without you I am so lost. I love you so much`,
        },
        {
          id: "note-2apr",
          type: "note",
          label: "2APRIL2026.txt",
          icon: "📝",
          content: `2nd April - 2026

It has been 6 hours only since the last page. I promised myself only one page a day so that I don't get too consumed by this habit. I am trying to be healthy and write out my thoughts. Maybe then I will articulate better and be able to communicate better.
We just had an argument right now. We have been arguing for almost 2 hours. You still think I am lying. You said I make you feel shittier every day. You asked me to "STOP FUCKING TEXTING" you. Now we are talking about what would've been nice. The thought of me moving away is nice. New start and all in another country. I am pretty sure you are thinking that too.
Right now, I am telling you about these easter eggs, or diary, or whatever this. I didn't really make it to vent out my emotions, it is more what I want to write in the chat for you.
I really missed you this whole week. I have been so down and hurt. Do you know that Charles hasn't texted me all week? It is crazy to me. Anyways, I have lots of school work to do, I kind of need your advice. I want to see how soon I can graduate based on my courses and stuff.
I keep looking at my phone hoping you text me and take it all back, and to let me console you. I wish I was able to. I really wish I could've taken all that pain to myself instead of causing it to you. I know I always sound ridiculous, but a lot of the time there is not a single thought going in my head. I know you think those are excuses, but my mental state switching to a dumbass is a really recurring event.
I have been reading our texts from early on, especially when you first flew to Armenia. I also found in the chat today the first time I told you I missed you. It brings me so much joy and sorrow. And also, I really wanted to finish the show (FOREVER). I kind of hoped you would block me on calls so I can leave you voicemails like the girl did in the show. I really wanted to be more vocal when telling you this stuff. I feel like I am more genuine when I speak than when I write something.
I am wondering a lot about how your day went, what food you ate, or what was your outfit today. I just saw your tiktok and I wanted to like and go tell you how pretty you are. You looked so damn pretty to the point that made me wanna shoot myself with a missile for letting this happen to us because of my idiocy.
I can't remove the idea from my head that you will move on, you will find someone who you can trust and make you feel good everyday. But you are that someone for me anush, I wanted to be that someone for you. It really hurts that I ran out of time before I could've been that someone for you
You have an early class tomorrow so I am guessing you are gonna be asleep soon. I know you are a nerd and will probably go even though it is the last month of classes. I know this is gonna be a stressful month for you. I wanted to be there to get you all matchas, redbulls, snacks, and cookies. I know you can get yourself but I liked doing it. I am pretty sure you will do great in the exams. I miss you a lot my love. I love you.`,
        },
        {
          id: "note-3apr",
          type: "note",
          label: "3APRIL2026.txt",
          icon: "📝",
          content: `3rd April - 2026

It is so warm today. It would have been a nice hangout. I really wanted to eat sushi too. I miss you a lot baby. My cousin came over today. I am so pissed off at this mf. I really can't deal with him right now. I haven't drank today but I think I will drink after this. I am already tearing up and can't really breathe. We talked today and sent tiktoks. I was pretty happy about that, yet it feels so weird. I also feel enraged at the same time, why the fuck are you pretending like this is dissolving away. I don't know about you but I genuinely would rather fucking die than see you moving on and just finiding yourself with someone else. Anyways, I wonder what you have been up to or how has your week been. You haven't yapped with me in so long. I have your picture next to the screen and imagining us yapping right now. I wanna say it brings me joy, but the fact that I have to imagine it makes my tears way more. I am imagining you saying "You wanna be friends right now". I like the yellow nails by the way. So sad I wont get more scratches. I keep replaying moments in my head. I have thought about our first time in the cinema a lot today. It was such a good day. I wish I could take back time there. I am doing so bad in life. I cannot bring myself to study, work, talk or even get out of bed. I have watched your last tiktok so much. You look so pretty and hot. Half of those views are me ;) I have been thinking what can I do to win you back. But I don't know how receptive you are to that. You seem pretty firm about your decision. I respect you so much for it, but the pain is greater than the respect. I feel like my clock has stopped since you left me. I am trying to text you this stuff less. I know I seem manipulative when I tell you this stuff, but fuck. You are my best friend. I never had to sugar coat or think of what should I say or what should I not say. Ironically, this is the first time ever I feel like I am intentionally holding back words from you. I really hate the fact I relapsed. I look terrible in front of everyone's eyes. I have seen a few tiktoks today that are about couples like us or us in a relationship. They were so funny. I should've saved them and put them here. Maybe you will read this one day and would wanna see them. Anyways, I think I will work a bit today. It is almost 8pm so maybe I can get some coding done and some school work. I have 2 finals and I am not even 10% ready. I think you are napping now, or locked in. I cannot unfortunately text and ask (maybe I will). I didn't wanna tell you about this habit, me writing to you instead of texting. I am not used to keeping things from you though. Anyways, I don't know when those letters will stop, I think never. I don't know why I am using proper English here and punctuation. I think because of those fucking red and blue lines. It pisses me off. I want to work on your game. There is so much to be done still but I am sorry babe, I am really not doing good. I guess it has to be a website again. Since you won't be with me for your birthday. I just texted you HAHAHAHA. I asked if you slept or locked in. I cannot stop looking at your pictures, I cannot stop texting you. Even if this keeps giving me the reality check of us not being together, I still will text. I thought at first about having this as a journal and giving you little updates throughout the day, but it is so schizophrenic though. I will keep it a page a day. We don't know how many days I will have to hold back my feelings from you. Maybe it will last a long time. I have to keep dreaming that one day you will read this and know I never stopped thinking about you, dreaming that I will hold you in my arms and tell you I will never make you feel this way again. If I don't think about it that way, I will go insane. I love you so much baby even on our worst days.`,
        },
        {
          id: "note-4apr",
          type: "note",
          label: "4APRIL2026.txt",
          icon: "📝",
          content: `4th April - 2026

I started moving the date to the header section in docs. It gives me two extra lines of things I want to say to you. Though, I don't know if this is enough to write to a girl as amazing as you. I don't think there is enough. I am writing this after we argued again. You hurt me a lot today. I know it might not be your intention, but it still hurts like hell. I get your point honestly. It sucks to feel like you don't know stuff about your partner or think they are hiding stuff from you. I feel bad not knowing how you feel or think like we used to, so I get your point when you say it sucks to feel like I am hiding stuff from you. I feel like I am losing my mind slowly the more you part away. I am writing this and I have no idea if you will ever see it. I want to win you back any way possible. I want to chase you until you trust me enough to get back with me. I really love you with all my heart. I saw this tiktok. I wanted to do this trend with you. I cannot send you this stuff so here it is https://vt.tiktok.com/ZSHUfFYKY/. I am saving a lot of reels and tiktoks hoping that I send them to you at some point. I keep saying I won't beg you again and won't do this again and I keep doing it and probably will. I have never been ashamed of those emotions, I am just ashamed I have to beg you to give me a chance or for you to listen to me and give me your ears and eyes again and try to believe me. I have missed you a lot. My sister asked me about you today. I broke down crying again. I have never cried this frequently or this much. I am shocked that I am. I never want to refer to us with "were" and "had". I wanted to keep the present tense. I know my terribleness has gotten us here, I cannot blame you for it, but I always had hoped that this would never happen. That you wouldn't be sick of me or doubt me. Today you said that I have never loved or appreciated you until you were gone. That made me so confused. Do you realize I never even realized that I am capable of loving someone this way until I was with you? I have loved you on all days, good and bad. I have loved who I am with you and what I want to become with you, and every time you say I have to let go, I feel like I lose another piece I love of who I am and who I want to become. It might've been easier if I didn't understand you or understand your reasons, but I do and I feel shit about myself for being those reasons. I don't know if anything can prove that I am who you know me to be. There are no extras and no hiding. I know it is unfair to ask you questions like "Would you ever see us in the future" because I know you cannot predict the future and know also that you are going through the same losses, I wish I could console you more than anything, and I wish I did not make that happen from the first place. I am begging you with all I got from self respect to just give me another string that I can connect to your heart with, no matter how thin or weak it is, I will hold on to it. I cannot keep telling you this in real life because I know your answer, I will just keep saying it here and hope your polaroid will say a different answer. I don't wanna argue when I say this stuff, I don't want to make things about me when I talk to you. I was just hurt with how you talked to me but you had every right. You said to me that maybe my feelings will change in 6 months and that maybe I will move on, but I know that on October 4th 2026, I will still be writing entries to you here most likely or tell you directly if I am blessed enough. The one thing that is better than this realm of you is the actual realm of you, saying this to you directly with no docs and no barriers. I know I acted erratic today once again and keep pushing the same conversation. I am sorry honey. I really missed you and want to hug you one more time and not let go. I love you so much as always. Feel better 💋`,
        },
        {
          id: "note-5apr",
          type: "note",
          label: "5APRIL2026.txt",
          icon: "📝",
          content: `Today we didn't talk much. I have missed you as always baby. I wish I could tell you that right now. This warm weather makes me think a lot about you. You are a really warm person. I never told you that, but you truly are. You are a very comforting person to be with. You have been using those weird emojis with me and I hate it so much. I want the stickers back, I want you back. I have the biggest urge to show you every proof I got, every single thing that can prove that I am not lying to you, but I don't know if it matters to you now or if it proves anything honestly. I want to fight this, I still do, but if it means fighting you and your will, I would just rather fight it here than make you feel bad everyday by pleading this. I haven't heard much about your day today, I wonder how it has been. I was really excited about stripe because we can do so much in summer and hangout whenever we want, now I am unsure if I still want it. It has been a week since all this happened. This is the longest we have gone like this. I guess writing to you here helps me live with those days. This is what I look for the most in my days. That's the reason I limited myself to one page, because if not I will just spend my whole day writing there and I will probably be too fixated on this habit that I don't know what to call yet. I can call it journaling, but it is not about me holistically, it is mostly about how I feel towards you. I am still as stuck as last Sunday. I have stopped drinking and started eating again. I started going to the gym everyday again and studying, but it is not distracting me from anything. I miss your smell, your touch, your smile, and your laugh so much. I miss yapping to you so much. I also miss your close friends highlights HAHAHAHA. I wish I was never removed. I am so torn and talking to you doesn't help really. You reply with those emojis and small responses. It hurts to share an emotion and get crying emojis as a response, but honestly you have every right. I just cannot get accustomed to this dynamic. I really love you, I truly do, but I don't want to show it if it's against what you want. If you don't want me to show those feelings, I won't. I just don't know how you feel about it. I guess this is the comforting thing here, I can just not expect a response. I imagine one, but don't expect it. I wonder what the future holds for us. I wonder if I will ever hold your hand again or smell your hair again. I wish I could just send you those whole ass essays. I know I say I wish a lot lately, I guess because you are not my reality anymore and back to being my wish like you were in September and October. It just hurts because I know I lost you unlike before where I wasn't sure if you like me before I confronted you. It also hurt because you were at least my best friend then, and now you are trying not to be. I have been listening to https://open.spotify.com/track/0nHYCn2olPodsflSaKiDt3?si=f88045189ea649dd a lot. It reminds me of you. He says "Let's stare at each other and let our eyes say all what we want to say". I wish we could do that. I have been wanting to call you for days now. I don't know what I would say or talk about. I just want to hear your voice. I want to tell you that I am sorry for everything, that you deserve the trust you seek, to beg you to let me show that you can trust me for one last time. I cannot ask you for this though. You have given enough with no return. You have stayed long enough to be decisive about it. I am looking at both your polaroids and the spotify stand as I write this today because I miss you extra today. It will be the 6th in 30 minutes. Should I write the next day's page when it hits 12 or should I wait till tomorrow? I can always write many pages. I just don't know if it is healthy or not. I also don't want a lot to accumulate if you ever read this. You have been asking me to see this and honestly I don't know if it is right to have told you I do this or not. I told you because it really occupied my mind. Maybe one day I will show you all this, or email you the link to the folder. Maybe I would put it on your website. Speaking of which, I have been brainstorming ideas for the game. There is a whole portion that needs to be redone since we are not together and I don't know if you would want there or not. I want you to be able to play this game even if you don't want me as your partner. Anyways, we will see what the future holds. I cannot speedrun it or skip to the future. Yes, I know I went above a page, but I will keep it in that range. I love you as always, all day, everyday. I hope your assignment is going well and that you are feeling better today.`,
        },
        {
          id: "note-6apr",
          type: "note",
          label: "6APRIL2026.txt",
          icon: "📝",
          content: `I wasn't planning on writing to you again. It is easier to move on if I don't. I am so drunk right now though and I give up. I have to write to you. We didn't talk at all today about our days. Mine was really boring. I did the interview, went to the gym, then drank a lot. I can't escape you, your smell, or your damn docs that I write. I just cannot. Why cant you get it through your thick skull that I fucking love you like why is it so difficult to fucking believe. You keep saying this absolute bullshit about moving on and no chance of getting back together but what the fuck are you talking about and saying some bullshit about my future man. I would rather fucking burn down the world than see you with that fuckass future man who is not me. I feel like I am losing myself to this. It seems like alcohol doesn't help either. It makes me stupid and still in love. By the way, my interview went really well. I think I will get it. I don't know yet though. I just want to move from here at this point. Every time I think my life is going well, I get slapped so hard by something going wrong. I was really mean and insulting today, I know that. I know I said some really hurtful stuff, but I think again I get too consumed with my own feelings and it's a shitty thing to do. I am sorry love, I didn't mean it I promise. You are a great person with a brighter heart. I wish I was in that heart though, but I guess we don't get what we wish or want at the very end of the day. I wonder how your day was. I am guessing you worked on your assignment and studied. I hope you are less sick today. For some reason, I cannot get angry at you here even if I was offended when we texted. I didn't lie to you about anything. I don't know why you would doubt the truth about this. I mean I get your doubts, but I don't know how to prove this stuff, or how to seem truthful. Anyways, you said it doesn't matter anymore. I don't know how you have moved on in one week. A week ago you were my best friend and the only one I confined in, and now you want us to not talk and text. It is so painful to hear you say this. Even if it is healthy, I just wanted to feel that what we have or had was mutual. I feel like you have never felt sure that you wanted me, and that sort of hurts. I mean you have explicitly said that you are tired of being unsure about me and that kind of fucked me up bad. Anyways, you have asked me to stop talking about my feelings and stop being this self centric and you are right honestly. I have seen your view story, it looks really pretty. I love that track too (Intro - Drake). I wonder if you posted on close friends lately. I miss it a lot. I miss your smell even more. You are the only person I wanted to feel wanted by. I feel like I am overflowing with my emotions here too. I want to make you feel listened and heard here but I cannot if you are not speaking :( I wish your polaroid spoke back to me. I have been staring at your contact and wondering if I should call. I really want to hear your voice. I miss calling you randomly and just yapping about whatever. I went to meet Leo and drink with him because I don't wanna keep bugging you with the broken record texts. I know you are sick of it by now and I don't want to keep overwhelming you with it. I know I will most likely end up texting you, because honestly I want to talk to you. I cannot accept that you are not for me or that I am not for you. I can accept that I am an asshole and that I need to put effort into changing. You say that people don't change, they just act, but no they do put effort and try for the ones they love. Me being an asshole faded that, but I want to put in the effort everyday even if you are not with me. I still think about the last time I saw you in the library. I wish you hugged me tighter and let my world just freeze there. I saw you put new tiktoks up. I am so happy about it, you don't get it. I screen recorded them fearing you would delete them again. I don't know if you are trying to move on at the moment, but I am not. I am still here with even more feelings than before. I am always stuck here. If I can choose where my mind and heart would be, I would still choose them to be on you. I would choose you in each realm, in my mind, in my heart, with my soul, and in my writings. I choose to dedicate those to you knowing that you might never see them. My days are still as bad because I am not with you baby. I love you a lot and miss you so fucking much. Till next writing or till you find me in your heart again`,
        },
        {
          id: "note-7apr",
          type: "note",
          label: "7APRIL2026.txt",
          icon: "📝",
          content: `I am so tired today. I just came back from work with barely any sleep and lots of alcohol in my body. I feel dead, but I still wanted to write to you. You told me you are sick and you didn't go to classes. I wish I could drop off a hot drink or something. I hope you feel better in no time pookie. How was your day, I am wondering. I try to imagine it but I wish I could hear it love. I keep seeing you in my dreams. I haven't written about this before but it consumes me so much. It makes me so fragile to see you in my dreams hugging and reaffirming me. You are the embodying of love in my head. I don't think that will ever change. I don't know if you are mad that I texted you when I was drunk. I am trying to stop this drinking habit and get back on track. I cannot seem to get anywhere when my most important person pulled away from my life in a matter of days though. I wish it wasn't like that. I saw you are tiktok today. You look the prettiest as always. Sarah is real for her comment, I am in love too. We did not talk as much today again. I tried to but I am trying to be respectful too. By the way, I won't find no fucking one in spain because I already found you why cannot just accept that I am in love with you and you only for fuck sake. You are genuinely driving me to the edge of insanity with your disbelief about me liking you. I can't let you go at all even if you let me go. I will always run back to you or stay at your door till you let me in. Sunrise was so pretty today, it made me think about us kissing at sunset or sunrise. I wonder if you think about those things too. I wonder if you think about me or miss us. I wish I could show all this love to you and make you feel the most safety and trust ever with me. I miss you with every breath I take, every word I speak, and every blink I blink. I want to appreciate you with each one of those and let you know every time I feel so that I appreciate and love you. I wish I was better at communication and made you trust me more. I am writing to you all this as I listen to all your voicemails. I miss your voice more than ever. I want to see you and just tell you all of this. I know those journals sound repetitive everyday, but how I feel about you never changes or is never less. I think this is the first day I don't open up the topic of us getting back together with you on chat. Don't get me wrong, I 100% wanted to, and was going to text you, but I am scared you would just block me everywhere so that you wouldn't have to hear that. I am so scared of it and so scared to be a memory you want to burn in your life, but I don't want to give up either. I don't know what to do honestly. I am so sleepy right now and I am excited for the chance to see you in my dreams. It is always so lovely. I want to text you that I am gonna go to sleep, but I am not sure if you would wanna hear this now. I think you want to be less confused about your life. I am trying to respect that and don't want to make you feel like I am being toxic about it, but I don't want you to move on. I want you to be stuck on us too. I want you to choose us again in a day, a month, or years. I will always be here, pookie. I want to send you this doc just to talk as we did or so that I can tell you that I love you more than I ever understood about love. Maybe I will budge and send you one day, who knows. My eyes are closing and I keep imagining you. I keep remembering all the moments and tearing up. It sucks so much and it sucks even more to know that I am the reason. I promise you I have never done you wrong. I assure you that. I wish I could assure you with proof. You deserve all that makes you feel trust, security and love. I will go to sleep now and most likely dream about you. I know it is fake, but I am still excited. I hope your studies are going well since you are studying now, miss you so fucking much as always. I love you so much my pookie, and it grows more every moment. Sending you all the kisses, hugs, and affection that can be sent. 💋`,
        },
        {
          id: "note-8apr",
          type: "note",
          label: "8APRIL2026.txt",
          icon: "📝",
          content: `I heard your voice today my love. I am so fucking happy I want to tell you how happy I am. I read your name on my screen. It was so euphoric. My heart was beating so fast out of joy. This was my favorite thing in the past days. I really needed this. You don't understand how much I have been craving your closeness to me. I have kissed your polaroid out of happiness. I feel like I have a secret crush on you all over again, and you know what, I want to do all of it all over again. Win you again, fight for you again, and go crazy over little things again. I remember I used to be so happy in October when I complimented you and you would say "DAMMMNN". Today, I feel the same way. I have been missing you with every bone, cell, and atom in my body. I want to beg for you in the most bare and authentic way possible baby. I need you so much. I need your presence so much, no matter what I have to do to earn it, I will. I am so happy we talked more than yesterday. I am scared that it would be confusing to you, and that you would tell me you need more space. However, every moment with you is the best win I can hope for in life, and I really want to make it worthwhile for you. I want to hug you so much now and tell you I am sorry and that I will be the best version I could be everyday just to earn an ounce of affection from you. You are really worth this and even way more than this. You look so fucking pretty in the story. I told you already but couldn't say enough, but you look so fucking hot it drives me insane. You were joking today about being with someone else, and I cannot tell you how much this drives me insane. Even jokingly, this shit makes me go so crazy, you cannot even imagine. I do like seeing you happy and seeing you post stories looking happy. It brings me joy more than anything honestly, and if your joy is in us parting ways, I will choose to write to you here and see you have your joy while I watch as a bystander. I don't want to do that because it makes me ache so much, but I will choose it if I know this is your joy. I know you still are confused and don't know what to do. I have looked at your tiktoks excessively today. You are so damn pretty babe. I have been thinking a lot about summer together, I feel like it would be a warmer summer if I am with you. It would be warmer for my heart and soul. Anyways, finals are coming and I am sending you all the support my baby. I know you will do great. I hope I get to spend enough time with you before you leave, even though I know that no amount of time is enough time to get enough of you. I have thought about coming to the library just to say hi and leave. I would get to see your face and smell your scent and obsess over them all the way back, but I want to give you your space. I wonder if we will hangout again, I wonder if I will ever get to kiss you and my whole world would freeze again. I wonder if I will ever feel this inner childish excitement when I go to the cinema with you and hold hands, or feel the absolute hunger and need for touching you when you are sitting next to me. I miss your fit checks a lot. You sent me one today and I hope you keep sending. You know, no matter how far away you are, no matter how much I show or don't. I love you to the extremes of love known to man kind, for almost a year, I have been growing more in love with you in ways I never knew I can grow nor feel. I will keep growing into that for you even if I am just a bystander. I will keep sharing my love through a doc, a chat between us, a look, or even in songs I listen to. You will stay the favorite part of my day my love even if you are worlds away from me emotionally and mentally. Also, in the most not toxic way ever, if you cannot find me in your heart again, I don't think I can ever live with the fact you find someone else in there. I am jealous about your heart more than anything. I do want to see you happy, and I cannot see you with someone else. Anyways, today I wonder less about your day here and learnt more about it from you when we texted, so that's good. I wonder if we will keep on that. What do you think? I guess I will see. I am very very happy about it though. Maybe this is the first time I have been that happy with not much sourness in those past days. Missing you insanely right now baby. I love you as always and as I always will. Till tomorrow or till I am in your heart again love. Also, you better not be texting none of your damn hoes`,
        },
        {
          id: "note-9apr",
          type: "note",
          label: "9APRIL2026.txt",
          icon: "📝",
          content: `We met today. I am so happy that we did and I have an overflow of emotions right. I am sitting next to Concordia writing this. I cannot tell you how much I have missed your scent and needed to see you and feel your presence. I need you to feel how much I have missed you. I don't know what your stance is about me though. And the more time that goes on, the more confused I become about it. I don't get if you like me or not. This is driving me to insanity though. I cannot live with the "Just friends" dynamic. I genuinely cannot. I don't know if you are giving me hints to stop trying, or if you want us together. I do want you though with all my heart though. I want your presence and your existence all the time. I crave your words, your touch, your funniness. I crave you so much and I cannot stop craving you in all honesty. I am happy I saw you today my love. I honestly don't know what this makes us honestly. I know I am working on getting you back, but I don't know what you are open to. I mean I get that you don't trust me and you need trust about those situations. The thing is, part of it would be way easier if I can give you closure about it one way or another. If I can prove that I didn't lie, or if I tell you I lied which I didn't. I am pretty sure this is where we are stuck. The thing is, I want to move past those situations. I want to put the effort to prove those and show you in the future that I am and always have been honest with you, and with everyone. I don't want to ask you for advice though, because it is my job to make that happen. Anyways, I am very happy we walked and talked today. I cannot tell you how happy I am. Your presence is really brightening to anybody around you, love. I feel like I have been telling you this more and more instead of writing here. I don't know if this is good or bad, but I love it. I hope it stays like this. I am sitting here reminiscing about all the nights spent in the library, all the episodes we watched together, all the secrets we shared, and all the moments we shared. It makes me feel whimsical to relive them, even if just in my head. I was about to kiss you today and hold you in my arms. I wanted to show you that there is nothing in my world that I would want as much as I want and need you. You looked so beautiful and pretty. I wanted to stand there and hug for hours. I wanted to kiss you and make it last forever. I didn't want this moment to end in any way. I stood downstairs tearing up because I didn't want this hour to end. I was going to ask you to keep walking around because I just want to freeze time there. I don't know what else to tell you here that I haven't already told you. I don't want to make this about how my days are or have been, these are all about you, love. I can write till forever about how lovely and brightening you are, but I don't wanna be repetitive. So maybe I will cut it short today and keep reminiscing. I love you so much and miss us so fucking much.

Side point but you will not be riding a motorcycle behind any guy who is not me. I will make sure to fucking burn it before you get on it. I know we are not together but you are tripping if you think you are gonna start talking to them hoes with motorcycles`,
        },
        {
          id: "note-10apr",
          type: "note",
          label: "10APRIL2026.txt",
          icon: "📝",
          content: `I am so fucking drunk and miserable now. I should have never texted you, but I just want you to feel and see that I am not that lying person that you see me as and it fucking pains and rages me so much that I cannot change this. I fucking adore you, I am genuinely disgustingly obsessed with you, I cannot lie to you. Everyone around me can see that, and they are fucking shocked you think that. I get why you see that though, and why you don't take their word for it. I drunk text you hoping that one time your arms open and you hug me, but that's honestly wrong. I get why they don't open. I don't know what I expect from us or what we would be. I was really optimistic yesterday, I have been more optimistic these days, but then we get back to those points where I genuinely get broken even more because I never realized this is how you always saw me at all moments and I was so oblivious to see that You have made it clear that you don't want us. I still like to think that you secretly do though. My biggest conspiracy theory is that you want us as much as I do right now. I sometimes try to get you to say it, but that's not really how it works. All of this is not about me though, it is about how down bad on my fucking knees I am for you, and you are too damn blind to see that. Come the fuck on anush, I wouldn't be fighting for us this much if I knew I did something wrong or if I based my relationship with you on lies. I wouldn't hold on to that connection that much if that was the case. Can't you fucking see that I have no eyes nor ears for no one but you? I get so fucking pissed when you treat me with this ominosity, like damn woman how more obsessed can I be with you so you can see there is no lies nor sneaky shit going on behind your back. How many more tears can I damn shed so that you see I was and am still genuine with you. Fuck I love you so much that I cannot type without feeling that burn in my heart because you are not with me. This shit hurts so fucking much physically and emotionally. I feel like a kid again when I would cry sometimes because my whole family would just abandon the fuck out of me when it was convinent to do so. I am so tired of being seen like this and I want to change it. I want you to think of the good of me and not assume the bad, that's all what I was trying because for some reason I thought this would be an easier way to get you to trust me. I was wrong though, I should've just proved it with no questions asked. Anyways I am going to go to sleep, I hope we talk tomorrow. I love you so much. I miss you so fucking much as always and forever. Please fucking see that. Please get it just once through your head that I won't give up even if you fucking will. You saying that you don't want us does not make me like you any fucking less just stop being so blind and fucking see it before I lose my mind. I fucking L O V E YOU`,
        },
        {
          id: "note-11apr",
          type: "note",
          label: "11APRIL2026.txt",
          icon: "📝",
          content: `So, we talked today. You wanted to cut me off which is more confusing than ever. I don't get who I am to you, or how you see me. You said some pretty mean stuff. But that's okay, I still love you more than ever girl. You didn't see the story I have posted till now, I don't know if you are doing that by intention or not but it is funny to be honest. You haven't asked me anything today so I will just share here and maybe you read it some day. My day was really boring, I went to the gym and studied and that's about it. Also, Omar wants to go to Harvard and has been talking to me about it all day. I trust he can do it though. I have missed you a lot today baby. I have missed whatever closeness I had with you at any time. I wish I can take back time to summer so that I can relive all with you. I guess my entries will be longer now since I have to stop telling you this stuff frequently. I don't know if you will stay this cold, or if we will talk more. I will always obsess over you though. Even if you don't know it, those documents will know it. I don't want to try to forget us or move over us. I don't know if you want or if you are already doing that. Anyways, I miss you a lot and I don't know who to tell or talk to if not you. I guess nobody. I wonder how your day was today. You didn't say much so I am curious. It has been 12 days that I have been writing to you. It still feels as good as day one. I don't think I will ever get bored of telling you how much I love, even through a doc. Do you think we will ever look back at this and think of how far we come? Or is this it? The connection between us was so instant and it was the same when you left, both so instant and when least expected. I know I gave you reasons to choose yourself, and I don't want you to feel bad for it. However, none of those reasons was me lying. It hurts to see that your biggest reason is something I know for a fact is wrong and I cannot prove it. I guess we will see with time what my efforts will get me to with you. You are engraved into my mind and soul, I cannot let you go from there even if you do let me go. I just want to hold you tight and tell you stop this and let me hug you. I wanted to hug you so tight when we were walking the other day, to tell you this is right, not us breaking apart. If you saw things from my perspective, you would know how lost in translation we are. Again, I don't wish to change your perspective, because you have it for a reason and you deserve to have what you have asked for and even more. It is just painful to watch you get there and I didn't do shit to stop it. I could've though. I am really sorry my love. I hope you find your heart one day feeling and believing that apology. I hope we talk more tomorrow. I miss you so much as everyday. I love you a lot. Stay locked in academic weapon. Love you so much`,
        },
        {
          id: "note-12apr",
          type: "note",
          label: "12APRIL2026.txt",
          icon: "📝",
          content: `Hey, I am sitting in the library and I can see you. I came over and said hi but you acted weird. I don't know if you are staying like this or we are moving over this point. I don't know if you are shutting me down or what. I am putting my all here, and you are acting all weird. I just miss you and miss us being usual. I don't get why you prefer this distance. I know you have reasons but I don't get the preference of not talking to me at all. You looked so fucking hot I wanted to show you how much I have missed you. I have just texted you to ask if all is good, and I know that the answer is no. I just want to hear it from you. I wish I could just go with the flow and let you just throw me hints and I follow them without having to address it. I don't know if you are expecting me to move on when you do this or what. I am pretty sure I won't move on. I can't believe you are seriously fucking telling me to move on like this is some sort of the fling while my soul is dissolving every single damn second I talk to you, see you, hear your voice, or text you. I end up being more fond of you every day and I cannot do anything about it. Why can't you see that for fuck sake. Why are you enraging me with this distance while you know how obsessed I am with you. I want you and no one else. I want to hold you in my arms and show you what it means to be that obsessed with someone.
 I still think of you every moment. I have been recording voice messages for you and just saving them instead of sending. I saw you put back tiktoks on your page. I love them. More for me to stalk. I just passed by next to you and you didn't notice me. I was happy to see you though love. I wonder if we will ever sit in the same booth in the library again. I wonder if we will yap and you will feel safe with me. I am torn that I hurt you and I cannot prove my intentions. I think it is better if I address them to you. You are my biggest motive, inspiration, and reflection in life. You pushed me to be who I am now and I am grateful for that. You made me a better man, son, sibling, and your biggest admirer. I will always be grateful you made me into that. I don't know if you are pushing me to get out of your life or what. I don't want out and I keep holding on to whatever I can hold onto. I have never been so persistent like I am about you. I have a rough week coming up and I wish I could have a hug. I just saw your second tiktok. I am the first like for both of your tiktoks. I guess that tells you how big of a fan I am. I am really trying here, I am trying with all I have of power and effort to fix the fuck up that I did. I admit it and I am fully responsible for it. I know I fucked up a lot, but I always saw a way for us out of any fuck up. You know if I was actually lying, I would just give both of us that closure and let you leave in peace and it would be better and easier for both of us. The thing is, we got to a point where you wholeheartedly believe that I lied to you multiple times. If I confirm it, it wouldn't change your perspective of me. All to say that, it would be easier for both of us to just tell you that I lied if I actually lied. I didn't though and I will stand on that forever. I would back that up everyday. I don't want to manipulate you when I say "Why do you think I would lie to you about something like this" . I genuinely just don't get why anybody would lie about this kind of stuff. I have never had this issue with anyone in my life, so I might lack perspective on it which makes me still find it hard to fully see. Anyways, I don't know if it is overdue for those talks. I have to get back to studying and missing you in my head and soul. I think I ask you how you feel whenever you are distant and when your behaviour changes. I know feelings don't change over a day, but when actions change, that means something has changed which is all that I am trying to understand. I am wondering what you have been up to and where your mind has been. I miss you a lot my love and I know I say it a lot, but I feel it even more often and more intensely than I can write it. I love you so much and hope you are studying well. Sending you all the love and support. Sending you also virtual matchas and redbulls. I love you babe.`,
        },
        {
          id: "note-13apr",
          type: "note",
          label: "13APRIL2026.txt",
          icon: "📝",
          content: `Hey babe, we just had a mini argument or whatever over the story you posted. AND YES IM REALLY FUCKING PISSED. I don't get how come you are so fucking excited to just ditch me and start going about life again. It makes me want to piss you off so much and at the same time I just don't want to. And that fuckass sentence where you said "I won't show you because you will get jealous", But you will fucking do it and post it just fine while knowing that. I don't get you. Why the fuck are you so blinded with resent and cannot see that I actually fucking love you. This makes me want to tear the fuck out of this resent and all the barries between us just for you to see my feelings. I fucking love you anush and this shit has to get through your head. I DAMN FUCKING LOVE GET THAT THROUGH YOUR HEAD. Do you think I like doing those fuckass conversations for fun and ask you everytime. I do get you fucking resent me and I get all but all this won't make my love less for shit. I don't want those fucking side hugs I want your actual hugs. I want to be able to fucking hold you and show you how much I fucking miss you. Just stop all of this and please don't make me insaner than whatever the fuck I am right now. I cannot take this distance and I cannot fucking take this boundary where I cannot be close to you physically and emotionally. I am gonna blow up for fuck sake because of that fucking burn I feel every single moment I cannot tell you how much I am fucking craving just an ounce of those moments. Anyways, we agreed not to keep arguing so I have to stop that. I am so raged on the inside though, it burns me so fucking much. My day has been so long, I think I am gonna go to sleep because I didn't sleep at all yesterday. I keep thinking, what are we going to turn out to be? The dynamic is a bit confusing right now, and I don't want to keep arguing about it, I want to enjoy what we have and that's it. I don't think I can ever work on hiding my feelings for you, or being cold with you. Something about you makes me want to show you all the love I have got for you. I will try to limit those confrontations so we can minimize arguments. It would be better for both of us. I still get this urge to make you understand that there is nothing I would do intentionally to make us apart. I am just an asshole sometimes, but I do love you and never was fake with you or masking my truth or anything. I hope you understand that love. I miss you so fucking much and it is hard living like this. I am so lost, but the only thing I know in all of this is that I love you so hard and so deep. I miss your laugh and your bullying of me. I will go to sleep now and once again be excited about you in my dreams. Hopefully we are closer to each other tomorrow. I love you baby.`,
        },
        {
          id: "note-14apr",
          type: "note",
          label: "14APRIL2026.txt",
          icon: "📝",
          content: `Hey love, I missed you a lot. I have been contemplating calling you. Today has been okay somewhat. We did sort of fight but we are okay now I hope. You look so fucking pretty today. I am glad you sent me pictures. I have been more direct today with you about my feelings and how much I have missed you. I feel like I have told you all what I would write. Still, the fact that we are not together rages me as much as ever. I don't know what to do at this point. You keep reminding me that we are not together, and that we are not talking so we get back with each other. As much as you say that, I am still hopeful you will find me in your heart. I do get raged everytime you talk about other guys and say they were flirting with you then you had a short convo with them. The thing is, I cannot be raged at you because I don't have the right to. It just makes me go crazy though. I have been losing my mind piece by piece everyday you are not with me. I am losing my mind even more fearing that as time goes by, you would prefer to push me away to keep on with your life. I don't know if this will happen at any point, but I am fearing the point where you might decide to fade away. I cannot take advice from anyone because everyone tells me to move on and let you move on, but that's exactly the opposite of what I want to hear. We did talk more today, I feel like we are getting back to our usual ish dynamic? But I still don't get what we are working towards. I keep writing, thinking, and hoping that one day you'd be mine again. I keep trying to find more reasons to convince you to get us back together. I don't know though. Anyways, I will stop for now to keep on texting you then write you here after.


SOOOOO WE HAD A PHONE CALL IM SO FUCKING HAPPY. You probably think I am insane now because of the instagram code thing, but honestly I just did it out of curiosity to see if it would work. I do feel like a psycho now though. HOWEVER IM SO FUCKING GLAD WE CALLED TODAY. I MANIFESTED IT EARLIERRRRR. Fuck I love you so much. I am also so happy because I got to say loving stuff. I cannot tell you how happy I am. It does feel a bit more confusing because I don't know what we can be out of this, but I guess we will see. I did want to tell you a few things or more like respond to a few things. I know you might think that I lied because I don't want to lose you. But I wouldn't betray you then try to keep you in my life while basing our connection on a lie. I am grown enough to know that it fails sooner or later. I know you don't care about this now. But I wrote it here in case you ever read this. I will go to sleep with my heart full of love just because I talked to you. I will keep writing to you those with the biggest smile and the most dense overflow of emotions you can ever imagine baby. No words can describe how much I love you. I miss you and your hangouts a lot, love. I hope we talk even more tomorrow.`,
        },
      ],
    },
    {
      id: "photos-folder",
      type: "folder",
      label: "Photos",
      icon: "🖼️",
      children: [
        { id: "photo-1", type: "image", label: "photo_1.jpg", icon: "🖼️", src: "images/AnushPhoto1.jpg" },
        { id: "photo-2", type: "image", label: "photo_2.jpg", icon: "🖼️", src: "images/AnushPhoto2.jpg" },
        { id: "photo-3", type: "image", label: "photo_3.jpg", icon: "🖼️", src: "images/AnushPhoto3.jpg" },
        { id: "photo-4", type: "image", label: "photo_4.jpg", icon: "🖼️", src: "images/AnushPhoto4.jpg" },
        { id: "photo-5", type: "image", label: "photo_5.jpg", icon: "🖼️", src: "images/AnushPhoto5.jpg" },
        { id: "photo-6", type: "image", label: "photo_6.jpg", icon: "🖼️", src: "images/AnushPhoto6.jpg" },
        { id: "photo-7", type: "image", label: "photo_7.jpg", icon: "🖼️", src: "images/AnushPhoto7.jpg" },
        { id: "photo-8", type: "image", label: "photo_8.jpg", icon: "🖼️", src: "images/AnushPhoto8.jpg" },
        { id: "photo-9", type: "image", label: "photo_9.jpg", icon: "🖼️", src: "images/AnushPhoto9.jpg" },
        { id: "photo-10", type: "image", label: "photo_10.jpg", icon: "🖼️", src: "images/AnushPhoto10.jpg" },
      ],
    },
    {
      id: "start-game",
      type: "app",
      label: "Start Game",
      icon: "▶️",
      action: "start-game",
    },
  ],

  // A subset of the icons above (matched by id) also shown pinned in the
  // dock at the bottom of the screen for quick access.
  dockIconIds: ["my-computer", "notes-folder", "photos-folder", "recycle-bin", "start-game"],
};

export const GAME = {
  title: "Greendrip Cafe",
  subtitle: "Walk up to the café and press P to help make the matcha",

  // How far you can walk from the center before being nudged back
  worldRadius: 100,

  // Length of the matcha-collecting minigame, in seconds
  roundSeconds: 60,
};

// ------------------------------------------------------------
// CLOUDS
// Soft, faded white cloud cover (procedural — no textures/GLBs needed)
// added to every level's sky, drifting slowly overhead. They're built
// from soft-edged sprites (not solid shapes) so they blend gently into
// the sky instead of reading as distinct hard-edged objects. Same
// settings apply to all four levels since each level builds its own
// independent set of clouds — tweak here to change the look everywhere.
// ------------------------------------------------------------
export const CLOUDS = {
  count: 42, // how many soft cloud clusters per level — more = fuller sky cover
  height: { min: 18, max: 42 }, // how high above the ground they float
  radius: 170, // spread wide so there's cloud cover overhead wherever she is
  puffsPerCluster: { min: 2, max: 4 }, // kept modest per-cluster since count went up, for performance
  scale: { min: 10, max: 20 }, // overall size of each cloud cluster, in meters
  driftSpeed: { min: 1.5, max: 3.5 }, // meters/second, drifting sideways — noticeably faster
  opacity: { min: 0.3, max: 0.55 }, // faded, not solid-white
  color: 0xffffff,
};

// ------------------------------------------------------------
// LEVEL SCENES
// Each level is a fully separate THREE.Scene — its own ground, lighting,
// and background/fog color — with no objects shared between them, so you
// can theme each one independently without affecting the others. Colors
// are hex numbers (0xRRGGBB). She spawns fresh at each level's own spot
// (facing -Z, toward wherever that level's environment sits) rather than
// walking continuously from one level into the next.
// ------------------------------------------------------------
export const LEVEL1_THEME = {
  background: 0xbfe3ff,
  fogColor: 0xcfe9ff,
  fogDensity: 0.006,
  // Warm pavement gray instead of grass — level 1 is a cute urban street
  // around the café, not a park (see URBAN_PROPS below for the rest).
  groundColor: 0xcfc9ba,
};
export const LEVEL1_SPAWN = { x: 0, y: 0, z: 10, rotationY: Math.PI };

// ------------------------------------------------------------
// LEVEL 1 URBAN SURROUNDINGS
// A little procedural street scene around the café — a lighter stone
// plaza right at her doorstep, a few pastel-colored buildings with lit
// windows across the street, street lamps, and some planter bushes. All
// built from simple shapes (boxes/cones/cylinders), no GLBs needed.
// ------------------------------------------------------------
export const URBAN_PROPS = {
  plaza: {
    color: 0xe8e2d2, // lighter stone patch right around the café
    radius: 13,
    position: { x: 0, y: 0.01, z: -12 },
  },
  buildings: [
    {
      position: { x: -16, y: 0, z: -6 },
      width: 5,
      depth: 5,
      height: 7,
      color: 0xffd6e0,
      roofColor: 0x8a5a44,
      rotationY: Math.PI / 10,
    },
    {
      position: { x: 16, y: 0, z: -6 },
      width: 5,
      depth: 5,
      height: 6,
      color: 0xcdeadd,
      roofColor: 0x5c6b73,
      rotationY: -Math.PI / 10,
    },
    {
      position: { x: -18, y: 0, z: -22 },
      width: 6,
      depth: 5,
      height: 8,
      color: 0xfff2c2,
      roofColor: 0x7a4b3a,
      rotationY: Math.PI / 14,
    },
    {
      position: { x: 18, y: 0, z: -22 },
      width: 6,
      depth: 5,
      height: 7.5,
      color: 0xd7e8ff,
      roofColor: 0x4a5560,
      rotationY: -Math.PI / 14,
    },
    // A few more little houses so the street feels more like a real
    // village block instead of just four buildings.
    {
      position: { x: -26, y: 0, z: -12 },
      width: 4.5,
      depth: 4.5,
      height: 6,
      color: 0xe0c7f0,
      roofColor: 0x6b4a7a,
      rotationY: Math.PI / 8,
    },
    {
      position: { x: 26, y: 0, z: -12 },
      width: 4.5,
      depth: 4.5,
      height: 6.5,
      color: 0xc7e0f0,
      roofColor: 0x3a5a6b,
      rotationY: -Math.PI / 8,
    },
    {
      position: { x: -22, y: 0, z: -34 },
      width: 5,
      depth: 5,
      height: 7,
      color: 0xffe4b3,
      roofColor: 0x8a5a2c,
      rotationY: Math.PI / 12,
    },
    {
      position: { x: 22, y: 0, z: -34 },
      width: 5,
      depth: 5,
      height: 6.5,
      color: 0xd4f0c7,
      roofColor: 0x4a6b3a,
      rotationY: -Math.PI / 12,
    },
  ],
  streetLamps: [
    { x: -6, z: 2 },
    { x: 6, z: 2 },
    { x: -10, z: -16 },
    { x: 10, z: -16 },
  ],
  treesOrPlanters: [
    { x: -4, z: 4 },
    { x: 4, z: 4 },
    { x: -12, z: -4 },
    { x: 12, z: -4 },
  ],
};

// ------------------------------------------------------------
// LEVEL 1 CELEBRATION: GIANT MATCHAS
// Once the matcha round ends, a handful of oversized matcha cups appear
// scattered around the plaza as a fun little celebration — purely
// decorative (not collectible), just for while she's exploring the café
// street afterward.
// ------------------------------------------------------------
export const GIANT_MATCHA = {
  count: 6,
  height: 2.6, // real-world size, meters tall (vs. 0.4m for the normal ones)
  spawnCenter: { x: 0, y: 0, z: -10 },
  spawnRadius: 16,
};

export const LEVEL2_THEME = {
  // A bigger, hazier, more "downtown" sky/fog than the other levels —
  // slightly grayer blue with a touch more fog density for that
  // big-city atmosphere between the skyscrapers.
  background: 0xa9c4d9,
  fogColor: 0xaab4bd,
  fogDensity: 0.008,
  groundColor: 0x8d9096, // concrete/asphalt instead of grass
};
export const LEVEL2_SPAWN = { x: 0, y: 0, z: 0, rotationY: Math.PI };

// ------------------------------------------------------------
// LEVEL 2 CITY SURROUNDINGS
// A little skyline around the gym — tall glassy skyscrapers with flat
// roofs and dense window grids, a concrete forecourt, and street lamps.
// Reuses the same building/plaza/lamp builders as level 1's URBAN_PROPS,
// just with a "major city" scale and palette instead of a cute village.
// ------------------------------------------------------------
export const CITY_PROPS = {
  plaza: {
    color: 0xb9bcc2, // concrete forecourt right around the gym
    radius: 16,
    position: { x: 0, y: 0.01, z: -42 },
  },
  buildings: [
    {
      position: { x: -24, y: 0, z: -30 },
      width: 8,
      depth: 8,
      height: 26,
      color: 0x8fa3b8,
      roofColor: 0x54606b,
      roofStyle: "flat",
      windowRows: 7,
      windowCols: 3,
      rotationY: Math.PI / 20,
    },
    {
      position: { x: 24, y: 0, z: -30 },
      width: 7,
      depth: 7,
      height: 34,
      color: 0x9fb0c4,
      roofColor: 0x4a5560,
      roofStyle: "flat",
      windowRows: 9,
      windowCols: 3,
      rotationY: -Math.PI / 20,
    },
    {
      position: { x: -28, y: 0, z: -55 },
      width: 9,
      depth: 9,
      height: 40,
      color: 0x7c93ab,
      roofColor: 0x3d4750,
      roofStyle: "flat",
      windowRows: 10,
      windowCols: 4,
      rotationY: Math.PI / 16,
    },
    {
      position: { x: 28, y: 0, z: -55 },
      width: 8,
      depth: 8,
      height: 30,
      color: 0x8898ac,
      roofColor: 0x46525c,
      roofStyle: "flat",
      windowRows: 8,
      windowCols: 3,
      rotationY: -Math.PI / 16,
    },
    {
      position: { x: -14, y: 0, z: -62 },
      width: 6,
      depth: 6,
      height: 20,
      color: 0xa6b6c9,
      roofColor: 0x5a6672,
      roofStyle: "flat",
      windowRows: 6,
      windowCols: 2,
      rotationY: Math.PI / 24,
    },
    {
      position: { x: 14, y: 0, z: -62 },
      width: 6,
      depth: 6,
      height: 22,
      color: 0x93a6bb,
      roofColor: 0x4e5a66,
      roofStyle: "flat",
      windowRows: 6,
      windowCols: 2,
      rotationY: -Math.PI / 24,
    },
    // A second, wider ring of skyscrapers so the skyline reads as fuller
    // and denser — more of a real downtown, less a handful of buildings.
    {
      position: { x: -36, y: 0, z: -20 },
      width: 6,
      depth: 6,
      height: 18,
      color: 0xa9b8c9,
      roofColor: 0x5a6672,
      roofStyle: "flat",
      windowRows: 5,
      windowCols: 2,
      rotationY: Math.PI / 18,
    },
    {
      position: { x: 36, y: 0, z: -20 },
      width: 7,
      depth: 7,
      height: 24,
      color: 0x93a6bb,
      roofColor: 0x46525c,
      roofStyle: "flat",
      windowRows: 6,
      windowCols: 3,
      rotationY: -Math.PI / 18,
    },
    {
      position: { x: -36, y: 0, z: -45 },
      width: 8,
      depth: 8,
      height: 32,
      color: 0x8394a8,
      roofColor: 0x3d4750,
      roofStyle: "flat",
      windowRows: 8,
      windowCols: 3,
      rotationY: Math.PI / 22,
    },
    {
      position: { x: 36, y: 0, z: -45 },
      width: 7,
      depth: 7,
      height: 28,
      color: 0x9aabc0,
      roofColor: 0x4a5560,
      roofStyle: "flat",
      windowRows: 7,
      windowCols: 3,
      rotationY: -Math.PI / 22,
    },
    {
      position: { x: -20, y: 0, z: -72 },
      width: 5,
      depth: 5,
      height: 16,
      color: 0xb0bfce,
      roofColor: 0x606c78,
      roofStyle: "flat",
      windowRows: 5,
      windowCols: 2,
      rotationY: Math.PI / 26,
    },
    {
      position: { x: 20, y: 0, z: -72 },
      width: 5,
      depth: 5,
      height: 18,
      color: 0x9cb0c5,
      roofColor: 0x525e6a,
      roofStyle: "flat",
      windowRows: 5,
      windowCols: 2,
      rotationY: -Math.PI / 26,
    },
  ],
  streetLamps: [
    { x: -8, z: -20 },
    { x: 8, z: -20 },
    { x: -8, z: -50 },
    { x: 8, z: -50 },
  ],
  // Streets running through the block — a main north-south avenue leading
  // straight to the gym, crossed by two side streets — so the ground
  // reads as a real city grid instead of a flat concrete slab.
  roads: [
    { position: { x: 0, z: -30 }, width: 7, length: 90, rotationY: 0 },
    { position: { x: 0, z: -18 }, width: 6, length: 76, rotationY: Math.PI / 2 },
    { position: { x: 0, z: -58 }, width: 6, length: 76, rotationY: Math.PI / 2 },
  ],
};

export const LEVEL3_THEME = {
  background: 0xbfe3ff,
  fogColor: 0xcfe9ff,
  fogDensity: 0.006,
  // The whole campus terrain is grass — a rich, natural green rather than
  // the paler mint tone used before.
  groundColor: 0x5fae52,
};
export const LEVEL3_SPAWN = { x: 0, y: 0, z: 0, rotationY: Math.PI };

// ------------------------------------------------------------
// LEVEL 3 CAMPUS GARDEN
// A garden walk leading up to Loyola — light posts and park benches lining
// the path, with bush planters scattered throughout (reuses the same
// streetLamp/bench/planter builders as the other levels). Kept clear of
// the flask (z:-70) and the molecule-spawn area (z:-58) in the middle of
// the path so nothing overlaps the actual minigame props.
// ------------------------------------------------------------
export const LEVEL3_GARDEN_PROPS = {
  // No separate plaza patch needed anymore — LEVEL3_THEME.groundColor
  // above is already grass green across the whole terrain.
  streetLamps: [
    { x: -10, z: -4 },
    { x: 10, z: -4 },
    { x: -14, z: -24 },
    { x: 14, z: -24 },
    { x: -16, z: -44 },
    { x: 16, z: -44 },
  ],
  benches: [
    { x: -9, z: -14, rotationY: Math.PI / 2 },
    { x: 9, z: -14, rotationY: -Math.PI / 2 },
    { x: -12, z: -34, rotationY: Math.PI / 2 },
    { x: 12, z: -34, rotationY: -Math.PI / 2 },
  ],
  treesOrPlanters: [
    { x: -6, z: -2 },
    { x: 6, z: -2 },
    { x: -14, z: -10 },
    { x: 14, z: -10 },
    { x: -18, z: -20 },
    { x: 18, z: -20 },
    { x: -16, z: -38 },
    { x: 16, z: -38 },
    { x: -20, z: -50 },
    { x: 20, z: -50 },
  ],
};

// ------------------------------------------------------------
// PLAYER CHARACTER
// ------------------------------------------------------------
export const PLAYER_MODEL = {
  glb: "models/player.glb",
  height: 1.8,
  yOffset: 0,
};

// ------------------------------------------------------------
// CAFE ENVIRONMENT
// The cafe model is a furniture set (counter, tables, stools) with no
// walls/floor of its own — the ground plane and lighting already in the
// scene serve as the "room." Adjust position/rotation/scale here if it
// looks too big/small/offset once you see it in-browser.
// ------------------------------------------------------------
export const CAFE = {
  glb: "models/cafe.glb",
  position: { x: 0, y: 0, z: -14 }, // straight ahead of the player's spawn point
  rotationY: -Math.PI / 2, // rotated 90° so the table/counter face the player
  // The source file's internal scale is unreliable (some models come out
  // absurdly huge or tiny), so instead of a fixed multiplier, the loader
  // measures the model after loading and auto-fits it so its widest
  // horizontal dimension matches this target size (in meters).
  targetWidth: 9,
  // This specific model has a handful of broken pieces baked in from its
  // export (a disconnected giant stray plane, and 4 small mispositioned
  // sphere props) — named explicitly here so they're excluded from sizing
  // and positioning instead of relying on guesswork.
  // Note: three.js's GLTFLoader strips periods from node names, so
  // Blender's "Sphere.001" becomes "Sphere001" here.
  excludeNodeNames: ["Plane", "Sphere", "Sphere001", "Sphere002", "Sphere003"],
};

// Banner/sign hung behind the cafe counter (on the far side from the
// player's approach), so the counter sits between her and the sign.
// With the 90° rotation above, the counter's footprint is now roughly
// 9m deep along Z, centered at z:-14, so the far edge is around z:-18.5 —
// this is a first estimate; nudge position.z further if it still overlaps.
export const CAFE_BANNER = {
  image: "images/green_drip_cafe.jpg",
  // Image is roughly square (109x117) — width/height below should keep
  // that aspect ratio unless you want to stretch it on purpose
  width: 2.2,
  height: 2.4,
  position: { x: 0, y: 3.2, z: -19.5 },
  rotationY: 0,
};

// How close the player needs to be to the cafe to see the "Press P" prompt.
// Near edge of the counter is now roughly z:-9.5 after the rotation.
export const CAFE_TRIGGER = {
  position: { x: 0, y: 0, z: -9.5 },
  radius: 7,
};

// ------------------------------------------------------------
// MATCHA COLLECTION MINIGAME
// Triggered by pressing P inside the trigger radius above.
// ------------------------------------------------------------
export const COLLECTIBLE = {
  glb: "models/matcha.glb",
  initialCount: 5, // how many are out when the timer starts
  spawnPerCollect: 1, // 1-for-1 replacement — keeps the on-screen count flat instead of growing (was causing lag)
  maxAlive: 8, // safety cap on how many can be on the ground at once
  height: 0.4, // real-world size each one is scaled to (meters tall)
  spawnCenter: { x: 0, y: 0, z: -8 }, // roughly in front of the cafe
  spawnRadius: 9, // scattered within this radius of the center above
  collectDistance: 1.2, // how close the player needs to walk to pick one up
};

// A little companion bird that floats beside her during Level 1 (Greendrip
// Cafe) and pipes up with a small floating speech bubble over its own head
// — never a full-screen overlay, so it never blocks the view. Purely
// procedural (no model asset), built in game.js.
export const BIRD_COMPANION = {
  bodyColor: 0x8ec9e0,
  bellyColor: 0xfff6e5,
  beakColor: 0xffb347,
  eyeColor: 0x2b2b2b,
  // Offset from the player's own position/heading — she rotates, the bird
  // rotates right along with her, staying just off her shoulder.
  offset: { x: 1.15, y: 1.75, z: -0.3 },
  scale: 1,
};

export const BIRD_MESSAGES = {
  intro:
    "hey babe, we are not gonna talk about why am I a bird. I didnt have time once again to model myself. Lets go to greendrip to get ur matcha",
  final:
    "I am not gonna have any matcha nor coffee. I am trying to reduce my coffee intake since a bird shat a day before ur birthday and for my amazing luck I am a bird here. I know you probably miss getting matcha now, thats why I have brought the matcha to you",
  level2Intro:
    "Now that we are done with matcha, lets gymmmmmm. We gotta walk to the gym now (idk why is it such a long walk)",
  level2WorkoutStart:
    "Now to workout, you gotta walk to each machine and hold R until it fills the bar to a certain point (freaky bar 😛)",
  level2JonAppears:
    "Since this mf wanna keep texting some bs trying to flirt with you, he is gonna get demolished here",
  level2JonDestroyed: "Gooooodddd Girllllllllllllll",
  level3Intro:
    "My bad for coloring again, its all AI. I just model. For this game, I have used my max knowledge about chemistry to produce something. I hope you like it baby",
  level3Final:
    "I dont know anything else about chemistry so my bad for how underwhelming this is. I know you are a chemistry weapon pookie",
  level4Intro: "thats your fav part huh (as it should be)",
  level4Final: "Goddamnnnnnnnnnnnnnn I wanna save all those pics on a polaroid",
};

// Shown once, right when the game starts
export const INTRO_MESSAGE = {
  title: "Greendrip Cafe",
  message:
    "Hey my love, I am glad you are finally trying the game. I apologize from now about the way the things are painted in the models. I assure you it is a technical limitation since the game is on web. Also I apologize that all your models have no feet. I kind of ate all them white toes. Have fun baby. I love you",
};

export const WIN_MESSAGE = {
  title: "Time's up!",
  message:
    "DAMNNNNN Matcha baddie. Putting all people on greendrip throughout the year. You now get your own greendrip in the game.",
};

// ------------------------------------------------------------
// LEVEL 2: THE GYM
// Unlocks once the café round above finishes. She gets a new outfit and
// walks over to the gym to pump up a strength meter.
// ------------------------------------------------------------
export const PLAYER_MODEL_2 = {
  glb: "models/player2.glb",
  height: 1.8,
  yOffset: 0,
};

export const GYM = {
  glb: "models/gym.glb",
  position: { x: 0, y: 0, z: -45 }, // further out past the café, a new area to walk to
  rotationY: 0,
  // Same auto-fit approach as the café — measures the model after loading
  // and scales it so its widest horizontal dimension matches this (meters).
  targetWidth: 30, // 3x the original 10m
  excludeNodeNames: [],
};

// How close the player needs to be to the gym to see the "Hold R" prompt.
// Widened along with the gym's 3x size bump above so the prompt still
// triggers near its (now much bigger) edges.
export const GYM_TRIGGER = {
  position: { x: 0, y: 0, z: -42 },
  radius: 18,
};

// Hold-R strength minigame. Press Enter near the gym (inside GYM_TRIGGER)
// to spawn the equipment below, then walk up to each machine and hold R
// there — every machine fills its own even share of the total bar, so all
// four need a turn before the bar reaches 100%. Progress at each machine
// is saved permanently once built up (no decay when you let go of R).
export const STRENGTH = {
  fillSeconds: 3, // how long a continuous hold at ONE machine takes to fill that machine's share
  machineRadius: 3, // how close she needs to be to a specific machine for R to count
};

// Equipment props that appear in the open area between the café and the
// gym once the minigame is started with Enter. Positions/sizes here are a
// first estimate (targetWidth = real-world meters, same auto-fit approach
// as CAFE/GYM) — nudge them once you see how they actually land in-browser.
// Each entry is also one of the four "stations" in the strength minigame.
// Pulled back another 8m from the gym (z:-45) so there's more open space
// between the equipment and the building itself.
export const GYM_EQUIPMENT = {
  items: [
    {
      name: "dumbbells",
      glb: "models/dumbbells.glb",
      targetWidth: 1.3,
      position: { x: -6, y: 0, z: -17 },
      rotationY: 0,
    },
    {
      name: "roman chair",
      glb: "models/roman_chair.glb",
      targetWidth: 2.2, // was too small at 1.1
      position: { x: -2, y: 0, z: -24 },
      rotationY: Math.PI / 6,
    },
    {
      name: "bench",
      glb: "models/bench.glb",
      targetWidth: 1.6,
      position: { x: 3, y: 0, z: -19 },
      rotationY: -Math.PI / 8,
    },
    {
      name: "machine",
      glb: "models/gym_machine.glb",
      targetWidth: 11.2, // 4x the original 2.8
      position: { x: 7, y: 0, z: -14 }, // pulled forward, away from the building
      rotationY: -Math.PI / 5,
    },
  ],
};

// Shown once, right when level 2 unlocks
export const LEVEL2_INTRO_MESSAGE = {
  title: "Club Sportif MAA",
  message:
    "I see you had enough of matcha. Thats why I modelled your gym too. I apologize for the colors again. AI did it. However you can have fun with the equipment I 3D made for you. I hope you like it. Also there is a suprise waiting for you after your workout HEHEHEHEHE",
};

export const LEVEL2_WIN_MESSAGE = {
  title: "Max strength!",
  message:
    "Okay okay gym hottie. Worked out and shrinked tf out of unc jon. Mf gonna pull up on you with the firearms.",
};

// ------------------------------------------------------------
// LEVEL 3: LOYOLA CAMPUS
// Unlocks once the gym round above finishes. Outfit swaps again, and she
// walks over to the campus. Enter starts the level (actual minigame logic
// to be added later — this is just the "arrive + press Enter" scaffold).
// ------------------------------------------------------------
export const PLAYER_MODEL_3 = {
  glb: "models/player3.glb",
  height: 1.8,
  yOffset: 0,
};

export const LOYOLA = {
  glb: "models/loyola_campus.glb",
  position: { x: 0, y: 0, z: -85 }, // further out past the gym, a new area to walk to
  rotationY: 0,
  // Same auto-fit approach as CAFE/GYM — measures the model after loading
  // and scales it so its widest horizontal dimension matches this (meters).
  // This is a big campus scan, so start wide; nudge once seen in-browser.
  targetWidth: 45,
  excludeNodeNames: [],
};

// How close the player needs to be to the campus to see the "Press Enter"
// prompt. First estimate — widen/narrow once you see how it lands in-browser.
export const LOYOLA_TRIGGER = {
  position: { x: 0, y: 0, z: -78 },
  radius: 20,
};

// Shown once, right when level 3 unlocks
export const LEVEL3_INTRO_MESSAGE = {
  title: "Level 3: Loyola Campus",
  message:
    "I am glad to hear you demolished that unc once again. I wanted to bomb him (how arab of me no bueno) but I thought demolishing is funnier. Now its loyola time. I was gonna make a part where we makeout, but I really dont want to model myself. I want this game to be about you and you only, so go have fun with the chemistry stuff I put there",
};

// ------------------------------------------------------------
// LEVEL 3, STAGE A: TITRATION SWEET SPOT
// Starts as soon as Enter is pressed near campus. Each press of R adds
// one "drop" (clickAmount%) to the burette — no holding. Land inside the
// highlighted target zone (targetMin–targetMax, in %) and the liquid
// turns pink (done!). Overshoot past targetMax and it resets so she can
// try again — no permanent fail state.
// ------------------------------------------------------------
export const TITRATION = {
  clickAmount: 12, // % added per press of R
  targetMin: 55, // % — start of the "endpoint" zone
  targetMax: 70, // % — end of the "endpoint" zone
};

// Big flask prop that sits in front of the Loyola building as the visual
// centerpiece for the titration stage — its liquid level rises live with
// the titration bar above, staying inside the flask's own silhouette, and
// turns pink once the titration lands in the target zone. Built
// procedurally (no GLB needed).
export const FLASK = {
  position: { x: 0, y: 0, z: -70 }, // between the player's approach and the building
  height: 3.4, // real-world size, meters tall
  liquidColor: 0x6fd1ff, // starting color, before the endpoint is reached
  successColor: 0xff5f9e, // color it turns once titrated correctly
};

// ------------------------------------------------------------
// LEVEL 3, STAGE B: MOLECULE BUILDER
// Once the titration succeeds, atom spheres spawn in the open area in
// front of campus (separate from the flask, so nothing overlaps it).
// Walking into one of the correct type collects it; walking into a decoy
// just removes it (no penalty). She cycles through every molecule in
// `molecules` below, building each one `roundsPerMolecule` times before
// moving to the next — once she's done all of them, the level is won.
// ------------------------------------------------------------
export const MOLECULE_BUILDER = {
  // Atom counts below match each molecule's real chemical formula (this
  // was wrong before — every atom type was set to 2 regardless of the
  // actual formula). `roundsPerMolecule` below is what controls "build it
  // twice", separately from how many of each atom a single build needs.
  molecules: [
    {
      formula: "H2O",
      atoms: [
        { symbol: "H", label: "Hydrogen", color: 0xffffff, count: 2 },
        { symbol: "O", label: "Oxygen", color: 0xff4d4d, count: 1 },
      ],
    },
    {
      formula: "CO2",
      atoms: [
        { symbol: "C", label: "Carbon", color: 0x333333, count: 1 },
        { symbol: "O", label: "Oxygen", color: 0xff4d4d, count: 2 },
      ],
    },
    {
      formula: "O2",
      atoms: [{ symbol: "O", label: "Oxygen", color: 0xff4d4d, count: 2 }],
    },
    {
      formula: "CH4",
      atoms: [
        { symbol: "C", label: "Carbon", color: 0x333333, count: 1 },
        { symbol: "H", label: "Hydrogen", color: 0xffffff, count: 4 },
      ],
    },
  ],
  // How many times each molecule above needs to be built before moving on
  // to the next one — "collect 2 per each" = build every molecule twice.
  roundsPerMolecule: 2,
  // Decoy atoms scattered in for a bit of a scavenger-hunt feel — collecting
  // one just removes it, it doesn't count toward the molecule or cost anything.
  // Nitrogen isn't used by any of the molecules above, so it's always a decoy.
  decoys: [{ symbol: "N", label: "Nitrogen", color: 0x4d79ff, count: 2 }],
  // Closer to the player's approach than the flask above (z:-70), so the
  // atoms spawn in the open area in front of campus and not on top of it.
  spawnCenter: { x: 0, y: 0, z: -58 },
  spawnRadius: 10,
  atomSize: 0.6, // sphere diameter in meters
  collectDistance: 1.3,
};

export const LEVEL3_WIN_MESSAGE = {
  title: "Molecule complete!",
  message:
    "My chemistry babe. I don't know any more molecules than those. I tried my best in this one.",
};

// ------------------------------------------------------------
// LEVEL 4: MIRROR SELFIES
// A little gallery of differently-shaped mirrors (built procedurally as
// real reflective surfaces — no GLB needed). Outfit swaps once more, and
// the goal is simple: walk up to any mirror and press P to snap a selfie
// (with a camera-flash effect) — do that requiredSelfies times to win.
// ------------------------------------------------------------
export const PLAYER_MODEL_4 = {
  glb: "models/player4.glb",
  height: 1.8,
  yOffset: 0,
};

export const LEVEL4_THEME = {
  background: 0xf6dfe6,
  fogColor: 0xf3e3dd,
  fogDensity: 0.005,
  groundColor: 0xe8d6cf, // blush pavement plaza instead of grass
};
export const LEVEL4_SPAWN = { x: 0, y: 0, z: 10, rotationY: Math.PI };

// ------------------------------------------------------------
// LEVEL 4 PHOTO-OP STREET WALL
// An outdoor "Instagram wall" backdrop behind the mirror gallery — a
// blush plaza, a row of colorful painted mural panels (drawn on canvas,
// no image files needed), a glowing neon sign, sagging string lights, and
// a bit of greenery framing the edges. Reuses createPlanter from level
// 1's URBAN_PROPS for the planters.
// ------------------------------------------------------------
export const PHOTO_WALL_PROPS = {
  plaza: {
    color: 0xf0e0da,
    radius: 15,
    position: { x: 0, y: 0.01, z: -10 },
  },
  // `style` picks the painted design: "sunset", "confetti", "hearts", or
  // "phrase" (renders `text` in a fun script). All drawn procedurally.
  muralWalls: [
    { position: { x: -9, y: 0, z: -20 }, width: 6, height: 4, style: "sunset" },
    { position: { x: -3, y: 0, z: -20 }, width: 6, height: 4, style: "confetti" },
    { position: { x: 3, y: 0, z: -20 }, width: 6, height: 4, style: "hearts" },
    {
      position: { x: 9, y: 0, z: -20 },
      width: 6,
      height: 4,
      style: "phrase",
      text: "SMILE!",
    },
  ],
  neonSign: {
    text: "MIRRORS FOR THE PRETTIEST AND MOST STUNNING TO EVER EXIST",
    position: { x: 0, y: 4.6, z: -19.8 },
    color: 0xff5f9e,
  },
  stringLights: {
    y: 4.3,
    z: -19.9,
    xStart: -12.5,
    xEnd: 12.5,
    sag: 0.35,
    bulbCount: 16,
    color: 0xffe9a8,
  },
  treesOrPlanters: [
    { x: -12, z: -6 },
    { x: 12, z: -6 },
    { x: -12, z: -14 },
    { x: 12, z: -14 },
  ],
};

// Each mirror is a real THREE.Reflector (an actual live reflection, not a
// fake texture). `shape` picks the outline: "rect", "circle", "oval",
// "arch", or "hex". `frameColor` tints the backing frame behind it so each
// one reads as its own distinct style.
export const MIRRORS = [
  {
    name: "gold rectangle",
    shape: "rect",
    width: 1.6,
    height: 2.4,
    position: { x: -8, y: 0, z: -10 },
    rotationY: Math.PI / 8,
    frameColor: 0xd4af37,
  },
  {
    name: "silver circle",
    shape: "circle",
    width: 1.8,
    height: 1.8,
    position: { x: -4, y: 0, z: -14 },
    rotationY: Math.PI / 16,
    frameColor: 0xc7c9cc,
  },
  {
    name: "rose gold oval",
    shape: "oval",
    width: 1.4,
    height: 2.2,
    position: { x: 0, y: 0, z: -16 },
    rotationY: 0,
    frameColor: 0xe0b0a8,
  },
  {
    name: "black arch",
    shape: "arch",
    width: 1.5,
    height: 2.3,
    position: { x: 4, y: 0, z: -14 },
    rotationY: -Math.PI / 16,
    frameColor: 0x1c1c1c,
  },
  {
    name: "wood hexagon",
    shape: "hex",
    width: 1.6,
    height: 1.8,
    position: { x: 8, y: 0, z: -10 },
    rotationY: -Math.PI / 8,
    frameColor: 0x8a5a34,
  },
];

export const MIRROR_SELFIE = {
  requiredSelfies: 10, // how many total selfies (across any mirrors) to win
  mirrorRadius: 2.2, // how close she needs to stand to a mirror to snap one
  flashDurationMs: 250, // how long the white camera-flash overlay stays visible
};

// Shown once, right when level 4 unlocks
export const LEVEL4_INTRO_MESSAGE = {
  title: "Level 4: Mirror Selfies",
  message:
    "My babe is a chemistry genius. I know how much you like mirror selfies. I have spent hours making sure I can design a mirror for you here so you can take 10 selfies in your game. Today is ur day baby 😛",
};

export const LEVEL4_WIN_MESSAGE = {
  title: "Mirrors for the prettiest and most stunning to ever exist",
  message:
    "I know how much you love reflective surface, now you can take mirror selfies all you want in ur own game.",
};

// ------------------------------------------------------------
// LEVEL 2 BONUS: DESTROY JON
// Not a separate level — once the strength bar above maxes out, a giant
// version of "Jon" shows up centered in front of the gym (still inside
// level 2's own city scene). Press B (a click each time, not a hold) to
// hit him. Each hit shrinks him IN PLACE (he doesn't shift position, only
// gets smaller) and flashes him red, kicking up a burst of debris; enough
// hits and he's demolished, which is what actually triggers
// LEVEL2_WIN_MESSAGE and the move on to level 3.
// ------------------------------------------------------------
export const JON = {
  glb: "models/jon.glb",
  // Centered (x:0) directly in front of the gym (gym itself is at z:-45),
  // past the equipment cluster (which sits roughly z:-14..-24).
  position: { x: 0, y: 0, z: -30 },
  rotationY: 0,
  // Sized by HEIGHT instead of width — exactly 3x the player's own height
  // (1.8m), so he's a consistent, proportional "giant" no matter how his
  // raw scan happens to be modeled, instead of an arbitrary width target.
  targetHeight: 5.4,
  excludeNodeNames: [],
};

export const DESTROY_JON = {
  hitsRequired: 12, // presses of B needed to fully destroy him
  proximityRadius: 10, // generous, since he's huge
  debrisPerHit: 8,
  debrisOnDestroy: 40,
};

// ------------------------------------------------------------
// LEVEL 5: THE GARDEN — birthday finale
// Unlocks once the mirror gallery above finishes. No more minigames here —
// just a pretty garden to wander through: flowering hedges, floating
// hearts drifting up through the air, a ring of 22 candles, 22 little
// birthday cakes, and a big message wall waiting at the far end with your
// own note painted on it. Same outfit as level 4 (no new PLAYER_MODEL_5).
// ------------------------------------------------------------
export const LEVEL5_THEME = {
  background: 0xfbe4ee,
  fogColor: 0xf7e6d8,
  fogDensity: 0.004,
  groundColor: 0x8fc98a, // soft grass green
  groundRadius: 45,
};
export const LEVEL5_SPAWN = { x: 0, y: 0, z: 20, rotationY: Math.PI };

// Shown once, right when the garden unlocks
export const LEVEL5_INTRO_MESSAGE = {
  title: "Happy 22nd Birthday",
  message:
    "this time I have actually designed a cake for you since I cannot buy you one on ur birthday. I hope you like it my love",
};

// ------------------------------------------------------------
// LEVEL 5 GARDEN SURROUNDINGS
// A ring of trimmed hedges bordering the lawn plus a few flower planters
// (reuses createPlanter from URBAN_PROPS). All procedural, no GLBs needed.
// ------------------------------------------------------------
export const GARDEN_PROPS = {
  hedgeRing: {
    center: { x: 0, z: -18 },
    radius: 22,
    count: 30,
  },
  treesOrPlanters: [
    { x: -12, z: 10 },
    { x: 12, z: 10 },
    { x: -16, z: -6 },
    { x: 16, z: -6 },
    { x: -9, z: -26 },
    { x: 9, z: -26 },
  ],
};

// Floating heart particles drifting slowly upward through the garden air —
// same soft camera-facing-sprite approach as the clouds, just heart-shaped,
// pink, and rising instead of white and drifting sideways up in the sky.
export const HEARTS = {
  count: 36,
  radius: 20, // scattered within this radius of the garden's center
  center: { x: 0, z: -18 },
  height: { min: 0.5, max: 11 }, // rises from near the ground up to this ceiling, then respawns low
  driftSpeed: { min: 0.35, max: 0.9 }, // meters/second, upward
  scale: { min: 0.5, max: 0.9 },
  color: 0xff6fa8,
};

// A ring of 22 candles (one per year!) around the garden's center, facing
// the message wall beyond them. Built procedurally — a striped cylinder
// body plus a small glowing flame on top.
export const CANDLES = {
  count: 22,
  center: { x: 0, z: -18 },
  radius: 8,
  height: 0.9,
  bodyColor: 0xfff8f0,
  stripeColor: 0xff8ac4,
  flameColor: 0xffb347,
};

// 22 little birthday cakes (your Cake.glb, cloned) arranged in a wider
// ring just outside the candles, so the whole garden center reads as one
// big birthday circle.
export const CAKES = {
  glb: "models/cake.glb",
  // 21 regular-sized cakes in a ring, plus one huge centerpiece cake right
  // in the middle (21 + 1 = 22, one per year).
  count: 21,
  center: { x: 0, z: -18 },
  radius: 13,
  // Same auto-fit approach as every other GLB prop — measures the model
  // once after loading and scales it so its widest horizontal dimension
  // matches this (meters). Cake.glb's raw scan is fairly large, so this
  // keeps each one to a cute, human-scale size — nudge once seen in-browser.
  targetWidth: 1.3,
  // The one giant cake standing at CAKES.center, in the middle of the ring.
  centerCakeTargetWidth: 4.5,
  excludeNodeNames: [],
};

// The finale — a big wall just past the candle/cake circle with YOUR OWN
// message painted on it (rendered on canvas, no image file needed). Edit
// `text` below to whatever you actually want it to say — use "\n" for a
// line break.
export const MESSAGE_WALL = {
  width: 16,
  height: 9,
  position: { x: 0, y: 0, z: -34 },
  bgColor: 0xfff6ea,
  frameColor: 0xff8ac4,
  textColor: "#ff5f9e",
  // ---> Write your real message here, however long you'd like — it
  // auto-wraps to fit the wall, "\n" just starts a new paragraph <---
  text: "Happy birthday to my love, my bestfriend, and my fav ever. You are truly the best thing that happened to me in so long. It is really a blessing that I get to celebrate and make those games for you baby. I hope I get to make them for you forever 🫶",
};
