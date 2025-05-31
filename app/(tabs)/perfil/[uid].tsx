/* -------------  PERFIL AJENO  ------------- */
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  arrayRemove, arrayUnion,
  collection, doc,
  onSnapshot,
  orderBy, query, updateDoc, where
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Dimensions, FlatList, Image, SafeAreaView,
  StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import { firestore } from "../../../config/firebase-config";
import { useAuth } from "../../../hooks/useAuth";
import { stylesCommon as C } from "../profile"; // reutilizamos tamaños

const { width } = Dimensions.get("window");
const IMG = C.IMG;

export default function OtherProfile() {
  const { uid } = useLocalSearchParams<{uid:string}>();
  const { user } = useAuth();
  const router   = useRouter();

  const [info,setInfo]   = useState<any>();
  const [posts,setPosts] = useState<any[]>([]);
  const [yoSigo,setYoSigo] = useState(false);

  /* datos del usuario */
  useEffect(()=>{ if(!uid) return;
    const ref=doc(firestore,"usuarios",uid);
    const unsub=onSnapshot(ref,(s)=>{
      if(!s.exists()) return;
      setInfo(s.data());
      setYoSigo(s.data().seguidores?.includes(user?.uid));
    });
    return unsub;
  },[uid,user?.uid]);

  /* sus publicaciones */
  useEffect(()=>{ if(!uid) return;
    const q=query(
      collection(firestore,"publicaciones"),
      where("userId","==",uid),
      orderBy("timestamp","desc")
    );
    return onSnapshot(q,(snap)=>
      setPosts(snap.docs.map((d)=>({id:d.id,...d.data()})))
    );
  },[uid]);

  if(!info) return <SafeAreaView style={s.center}><Text>Cargando…</Text></SafeAreaView>;

  /* seguir/dejar de seguir */
  const toggleFollow = async ()=>{
    if(!user) return;
    const miRef   = doc(firestore,"usuarios",user.uid);
    const suRef   = doc(firestore,"usuarios",uid!);
    await updateDoc(miRef,{
      siguiendo: yoSigo ? arrayRemove(uid) : arrayUnion(uid)
    });
    await updateDoc(suRef,{
      seguidores: yoSigo ? arrayRemove(user.uid) : arrayUnion(user.uid)
    });
  };

  const seguidores = info.seguidores?.length ?? 0;
  const siguiendo  = info.siguiendo?.length  ?? 0;

  return (
    <SafeAreaView style={s.container}>
      {/* nombre y plataforma centrados */}
      <View style={s.nameBox}>
        <Text style={s.nameTxt}>{info.username}</Text>
        {info.plataformaFav && (
          <Text style={s.platform}>{info.plataformaFav}</Text>
        )}
      </View>

      {/* avatar + stats + btns */}
      <View style={s.row}>
        <Image source={{uri:info.fotoPerfil}} style={s.avatar}/>
        <View style={s.statsRow}>
          <Counter n={posts.length} label="Contenido"/>
          <Counter n={seguidores}   label="Seguidores"/>
          <Counter n={siguiendo}    label="Seguidos"/>
        </View>

        {/* botones */}
        <View style={{alignItems:"center",gap:8}}>
          <TouchableOpacity style={[s.followBtn, yoSigo && {backgroundColor:"#ddd"}]} onPress={toggleFollow}>
            <Text style={{color:yoSigo?"#000":"#fff",fontWeight:"600"}}>
              {yoSigo?"Seguido":"Seguir"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.msgBtn}
            onPress={()=>router.push({pathname:"/chats",params:{uid}})}
          >
            <Feather name="message-circle" size={18} color="#000"/>
          </TouchableOpacity>
        </View>
      </View>

      {/* género + bio */}
      {info.generoFav && <Text style={s.genres}>{info.generoFav}</Text>}
      {info.descripcion && <Text style={s.bio}>{info.descripcion}</Text>}

      {/* grid 2×n */}
      <FlatList
        data={posts}
        numColumns={2}
        keyExtractor={(p)=>p.id}
        columnWrapperStyle={{gap:4}}
        contentContainerStyle={{gap:4,paddingBottom:80}}
        renderItem={({item})=>(
          <TouchableOpacity activeOpacity={0.9}
            onPress={()=>router.push({pathname:"/publicacion/[id]",params:{id:item.id}})}
          >
            <Image source={{uri:item.mediaUrl}} style={s.gridImg}/>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function Counter({n,label}:{n:number,label:string}){return(
  <View style={{alignItems:"center"}}>
    <Text style={{fontWeight:"700"}}>{n}</Text>
    <Text style={{fontSize:12,color:"#555"}}>{label}</Text>
  </View>
);}

/* estilos */
const s = StyleSheet.create({
  ...StyleSheet.create({}),                // placeholder para no perder IntelliSense
  container:{flex:1,backgroundColor:"#fff",padding:16},
  center:{flex:1,justifyContent:"center",alignItems:"center"},
  nameBox:{alignItems:"center",marginBottom:12},
  nameTxt:{fontSize:22,fontWeight:"700"},
  platform:{color:"#888",marginTop:2},
  row:{flexDirection:"row",alignItems:"center",marginBottom:14},
  avatar:{width:C.PHOTO,height:C.PHOTO,borderRadius:C.PHOTO/2},
  statsRow:{flex:1,flexDirection:"row",justifyContent:"space-around",marginLeft:C.GAP},
  followBtn:{backgroundColor:"#42BAFF",paddingVertical:6,paddingHorizontal:16,borderRadius:20},
  msgBtn:{borderWidth:1,borderColor:"#000",borderRadius:20,padding:6},
  genres:{fontWeight:"600",fontSize:15,marginBottom:4},
  bio:{color:"#000",marginBottom:12},
  gridImg:{width:IMG,height:IMG*1.2,borderRadius:10},
});
