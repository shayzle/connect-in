<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{

    // permet de faire l'inscription de l'utilisateur en validant les champs et en créant un token pour la session
    public function register(Request $request)
    {
        //validation des champs d'inscription, on vérifie que les champs sont bien remplis et que l'email est unique dans la table users
        $validated = $request->validate([
            'firstname' => ['required', 'string', 'max:100'],
            'lastname'  => ['required', 'string', 'max:100'],
            'email'     => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'  => ['required', Password::min(8)],
        ]);
        // création de l'utilisateur avec les données validées, on hash le mot de passe pour le sécurisé (en le cryptant)
        $user = User::create([
            'firstname' => $validated['firstname'],
            'lastname'  => $validated['lastname'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
        ]);
        //création d'un token pour l'utilisateur qui vient de s'inscrire, ce token sera utilisé pour les requêtes authentifiées
        $token = $user->createToken('react')->plainTextToken;
        // on retourne une réponse JSON avec les informations de l'utilisateur et le token d'authentification, avec un code de statut 201 (created)
        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }
    //permet de faire la connexion de l'utilisateur en vérifiant les identifiants et en créant un token pour la session
    public function login(Request $request)
    {
        //on check si les champs email et password sont remplis et valide 
        $validated = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);
        // on cherche l'utilisateur dans la base de données en fonction de l'email fourni, si l'utilisateur n'existe pas ou si le mot de passe ne correspond pas, on return une réponse JSON avec un message d'erreur et un code de statut 401 (unauthorized)
        $user = User::where('email', $validated['email'])->first();
        // la fonction hash::check permet de comparer le mot de passe fourni avec le mot de passe stocké dans la base de données (qui est hashé), si les identifiants sont validés, on supprime les tokens existants de l'utilisateur pour éviter les sessions multiples, puis on crée un nouveau token pour la session actuelle et on return une réponse JSON avec les infos de l'utilisateur et le token d'authentification
        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $user->tokens()->delete();
        // c'est ici qu'on créer un nouveau token pour l'utilisateur
        $token = $user->createToken('react')->plainTextToken;
        // on return une réponse json avec les info de l'user et le token d'authentification
        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }
    //cette fonction permet de return les infos de l'user, elle est protégée par le middleware (auth:sanctum) il va vérifier que la requête contient un token d'authentification valide
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
    //cette fonction elle permet de mettre à jour les info de l'utilisateur
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'firstname' => ['required', 'string', 'max:100'],
            'lastname'  => ['required', 'string', 'max:100'],
            'email'     => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password'  => ['nullable', Password::min(8)],
        ]);

        $user->firstname = $validated['firstname'];
        $user->lastname = $validated['lastname'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json($user);
    }
    //cette fonction sert à se déconnecter en supprimant le token actuel de l'user
    public function logout(Request $request)
    {

        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté']);
    }
    //cette fonction permet de supprimer le compte
    public function destroy(Request $request)
    {
        $user = $request->user();


        $user->tokens()->delete();


        $user->delete();

        return response()->json(['message' => 'Compte supprimé']);
    }
}
